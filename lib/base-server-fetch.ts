export type BaseQueryParams = Record<string, string | number | boolean | undefined | null>;

export interface BaseServerRequestOptions extends Omit<RequestInit, "body" | "method"> {
    body?: unknown;
    params?: BaseQueryParams;
    timeoutMs?: number;
}

export class BaseServerHttpError extends Error {
    constructor(
        public readonly status: number,
        message: string,
        public readonly raw?: unknown,
    ) {
        super(message);
        this.name = "BaseServerHttpError";
    }
}

export class BaseServerApiError extends Error {
    constructor(
        public readonly code: number,
        message: string,
        public readonly data?: unknown,
    ) {
        super(message);
        this.name = "BaseServerApiError";
    }
}

type BodylessOptions = Omit<BaseServerRequestOptions, "body" | "method">;
type BodyOptions = Omit<BaseServerRequestOptions, "method">;

export interface CreateBaseServerFetchOptions {
    baseURL?: string;
    headers?: HeadersInit;
    timeoutMs?: number;
    credentials?: RequestCredentials;
    authHeaders?: HeadersInit | (() => HeadersInit | Promise<HeadersInit | undefined> | undefined);
    onHttpUnauthorized?: (response: Response) => void | Promise<void>;
    envelope?: {
        enabled?: boolean;
        codeField?: string;
        messageField?: string;
        dataField?: string;
        successCodes?: number[];
        unauthorizedCodes?: number[];
        onUnauthorizedCode?: (code: number, payload: unknown) => void | Promise<void>;
        returnDataOnly?: boolean;
    };
}

export interface BaseServerFetchClient {
    get<T>(path: string, options?: BodylessOptions): Promise<T>;
    post<T>(path: string, body?: unknown, options?: BodylessOptions): Promise<T>;
    put<T>(path: string, body?: unknown, options?: BodylessOptions): Promise<T>;
    patch<T>(path: string, body?: unknown, options?: BodylessOptions): Promise<T>;
    delete<T>(path: string, options?: BodyOptions): Promise<T>;
}

function appendQuery(path: string, params?: BaseQueryParams): string {
    if (!params) return path;
    const qIndex = path.indexOf("?");
    const pathname = qIndex === -1 ? path : path.slice(0, qIndex);
    const existingSearch = qIndex === -1 ? "" : path.slice(qIndex + 1);
    const qs = new URLSearchParams(existingSearch);
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) {
            qs.set(k, String(v));
        }
    }
    const str = qs.toString();
    return str ? `${pathname}?${str}` : pathname;
}

function joinUrl(baseURL: string, path: string): string {
    if (path.startsWith("http")) return path;
    if (!baseURL) return path;
    if (baseURL.endsWith("/") && path.startsWith("/")) {
        return `${baseURL}${path.slice(1)}`;
    }
    if (!baseURL.endsWith("/") && !path.startsWith("/")) {
        return `${baseURL}/${path}`;
    }
    return `${baseURL}${path}`;
}

function normalizeHeaders(headers: HeadersInit | undefined): Record<string, string> {
    if (!headers) return {};
    if (headers instanceof Headers) {
        const result: Record<string, string> = {};
        for (const [key, value] of headers.entries()) {
            result[key] = value;
        }
        return result;
    }
    if (Array.isArray(headers)) {
        const result: Record<string, string> = {};
        for (const [key, value] of headers) {
            result[key] = value;
        }
        return result;
    }
    return { ...(headers as Record<string, string>) };
}

async function resolveDynamicHeaders(
    headers:
        | HeadersInit
        | (() => HeadersInit | Promise<HeadersInit | undefined> | undefined)
        | undefined,
): Promise<Record<string, string>> {
    if (!headers) return {};
    if (typeof headers === "function") {
        const resolved = await headers();
        return normalizeHeaders(resolved);
    }
    return normalizeHeaders(headers);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return Object.prototype.toString.call(value) === "[object Object]";
}

function resolveRequestBody(
    body: unknown,
    headers: Record<string, string>,
): { body: BodyInit | undefined; headers: Record<string, string> } {
    if (body === undefined || body === null) {
        return {
            body: undefined,
            headers,
        };
    }
    if (
        typeof body === "string" ||
        body instanceof FormData ||
        body instanceof URLSearchParams ||
        body instanceof Blob ||
        body instanceof ArrayBuffer ||
        ArrayBuffer.isView(body)
    ) {
        return {
            body: body as BodyInit,
            headers,
        };
    }
    if (isPlainObject(body) || Array.isArray(body)) {
        if (!Object.keys(headers).some((key) => key.toLowerCase() === "content-type")) {
            headers["Content-Type"] = "application/json";
        }
        return {
            body: JSON.stringify(body),
            headers,
        };
    }
    return {
        body: body as BodyInit,
        headers,
    };
}

async function parseResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
        return undefined as T;
    }
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
        return (await response.json()) as T;
    }
    return (await response.text()) as T;
}

export function createBaseServerFetch(
    options: CreateBaseServerFetchOptions = {},
): BaseServerFetchClient {
    const {
        baseURL = "",
        headers: defaultHeaders,
        timeoutMs: defaultTimeoutMs = 15_000,
        credentials,
        authHeaders,
        onHttpUnauthorized,
        envelope,
    } = options;
    const envelopeEnabled = envelope?.enabled ?? false;
    const codeField = envelope?.codeField ?? "code";
    const messageField = envelope?.messageField ?? "msg";
    const dataField = envelope?.dataField ?? "data";
    const successCodes = envelope?.successCodes ?? [0, 200];
    const unauthorizedCodes = envelope?.unauthorizedCodes ?? [401];
    const returnDataOnly = envelope?.returnDataOnly ?? true;

    async function request<T>(
        method: string,
        path: string,
        requestOptions: BaseServerRequestOptions = {},
    ): Promise<T> {
        const { body, params, headers: extraHeaders, timeoutMs, ...rest } = requestOptions;
        const url = appendQuery(joinUrl(baseURL, path), params);
        const resolvedAuthHeaders = await resolveDynamicHeaders(authHeaders);
        const finalHeaders = {
            ...normalizeHeaders(defaultHeaders),
            ...resolvedAuthHeaders,
            ...normalizeHeaders(extraHeaders),
        };
        const finalRequestBody = resolveRequestBody(body, finalHeaders);
        const response = await fetch(url, {
            ...rest,
            method,
            credentials,
            headers: finalRequestBody.headers,
            body: finalRequestBody.body,
            signal: AbortSignal.timeout(timeoutMs ?? defaultTimeoutMs),
        });
        if (response.status === 401) {
            await onHttpUnauthorized?.(response);
        }
        if (!response.ok) {
            const contentType = response.headers.get("content-type") ?? "";
            const raw = contentType.includes("application/json")
                ? await response
                      .clone()
                      .json()
                      .catch(() => undefined)
                : await response
                      .clone()
                      .text()
                      .catch(() => undefined);
            const message =
                typeof raw === "string"
                    ? raw
                    : raw && typeof raw === "object"
                      ? (((raw as Record<string, unknown>).msg ??
                            (raw as Record<string, unknown>).message) as string | undefined)
                      : undefined;
            throw new BaseServerHttpError(
                response.status,
                message || `HTTP ${response.status}: ${response.statusText}`,
                raw,
            );
        }
        const payload = await parseResponse<unknown>(response);
        if (envelopeEnabled && payload && typeof payload === "object") {
            const record = payload as Record<string, unknown>;
            const codeValue = record[codeField];
            if (typeof codeValue === "number") {
                if (unauthorizedCodes.includes(codeValue)) {
                    await envelope?.onUnauthorizedCode?.(codeValue, payload);
                }
                if (!successCodes.includes(codeValue)) {
                    const messageValue = record[messageField];
                    const fallbackMessage =
                        typeof messageValue === "string" && messageValue
                            ? messageValue
                            : `API code ${codeValue}`;
                    throw new BaseServerApiError(codeValue, fallbackMessage, record[dataField]);
                }
                return (returnDataOnly ? record[dataField] : record) as T;
            }
        }
        return payload as T;
    }

    return {
        get<T>(path: string, requestOptions?: BodylessOptions): Promise<T> {
            return request<T>("GET", path, requestOptions);
        },
        post<T>(path: string, body?: unknown, requestOptions?: BodylessOptions): Promise<T> {
            return request<T>("POST", path, { ...requestOptions, body } as BodyOptions);
        },
        put<T>(path: string, body?: unknown, requestOptions?: BodylessOptions): Promise<T> {
            return request<T>("PUT", path, { ...requestOptions, body } as BodyOptions);
        },
        patch<T>(path: string, body?: unknown, requestOptions?: BodylessOptions): Promise<T> {
            return request<T>("PATCH", path, { ...requestOptions, body } as BodyOptions);
        },
        delete<T>(path: string, requestOptions?: BodyOptions): Promise<T> {
            return request<T>("DELETE", path, requestOptions);
        },
    };
}
