// lib/basic-request.ts
// 与业务无关的通用 fetch 封装，可跨项目复用。
// 默认不绑定特定响应信封结构（如 code/data/msg），直接返回后端原始成功数据。

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

/** 通用请求参数：支持 query、body、signal，并透传原生 RequestInit 其他字段 */
export interface RequestOptions extends Omit<RequestInit, "body" | "method"> {
    body?: unknown;
    params?: QueryParams;
    signal?: AbortSignal;
    servicePrefix?: string;
    disableServicePrefix?: boolean;
    timeoutMs?: number;
    retry?: Partial<RetryOptions> | false;
    fallbackBaseURLs?: string[];
    failover?: Partial<FailoverOptions> | false;
    streaming?: boolean;
    sensitiveFields?: Partial<SensitiveFields>;
    dedupe?: Partial<DedupeOptions> | false;
    getCache?: Partial<GetCacheOptions> | false;
    concurrency?: Partial<ConcurrencyOptions> | false;
}

/** 客户端实例级配置 */
export interface HttpClientOptions {
    baseURL?: string;
    fallbackBaseURLs?: string[];
    servicePrefixes?: Record<string, string>;
    defaultServicePrefix?: string;
    credentials?: RequestCredentials;
    headers?: Record<string, string>;
    onUnauthorized?: (response: Response) => void | Promise<void>;
    timeoutMs?: number;
    retry?: RetryOptions | false;
    failover?: FailoverOptions | false;
    sensitiveFields?: SensitiveFields;
    dedupe?: DedupeOptions | false;
    getCache?: GetCacheOptions | false;
    concurrency?: ConcurrencyOptions | false;
    middlewares?: HttpMiddleware[];
    envelope?: {
        enabled?: boolean;
        successCodes?: number[];
    };
}

export interface FailoverOptions {
    switchOnStatusCodes?: number[];
    switchOnNetworkError?: boolean;
    switchOnTimeout?: boolean;
}

export interface SensitiveFields {
    headers?: string[];
    body?: string[];
    mask?: string;
}

export interface IdempotentContext {
    method: string;
    path: string;
    options: RequestOptions;
}

export interface DedupeOptions {
    enabled?: boolean;
    methods?: string[];
    key?: (context: RequestContext) => string;
}

export interface GetCacheEntry {
    data: unknown;
    expiresAt: number;
}

export interface GetCacheOptions {
    enabled?: boolean;
    ttlMs?: number;
    maxSize?: number;
    methods?: string[];
    key?: (context: RequestContext) => string;
    storage?: Map<string, GetCacheEntry>;
}

export interface ConcurrencyOptions {
    enabled?: boolean;
    maxConcurrent?: number;
}

export interface RetryContext {
    attempt: number;
    method: string;
    path: string;
    error: unknown;
}

export interface RetryOptions {
    retries?: number;
    retryDelayMs?: number;
    maxRetryDelayMs?: number;
    backoffFactor?: number;
    jitter?: boolean;
    retryableStatusCodes?: number[];
    retryableMethods?: string[];
    shouldRetry?: (context: RetryContext) => boolean | Promise<boolean>;
    isIdempotent?: (context: IdempotentContext) => boolean | Promise<boolean>;
}

export interface RequestContext {
    method: string;
    path: string;
    url: string;
    attempt: number;
    options: RequestOptions;
    request: {
        method: string;
        path: string;
        url: string;
        headers: Record<string, string>;
        body: unknown;
        credentials?: RequestCredentials;
    };
    safeHeaders: Record<string, string>;
    safeBody: unknown;
}

export interface ResponseContext extends RequestContext {
    response: Response;
    durationMs: number;
}

export interface ErrorContext extends RequestContext {
    error: unknown;
    durationMs: number;
}

export interface HttpMiddleware {
    onRequest?: (
        context: RequestContext,
    ) => void | Promise<void> | RequestMutation | Promise<RequestMutation | void>;
    onResponse?: (context: ResponseContext) => void | Promise<void>;
    onError?: (context: ErrorContext) => void | Promise<void>;
}

export interface RequestMutation {
    method?: string;
    path?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: unknown;
    credentials?: RequestCredentials;
}

export interface LoopRequestOptions<TPage, TItem> {
    request: (context: { pageIndex: number; signal?: AbortSignal }) => Promise<TPage>;
    extractItems: (page: TPage) => TItem[] | null | undefined;
    hasMore?: (page: TPage, items: TItem[], pageIndex: number, allItems: TItem[]) => boolean;
    advance?: (page: TPage, items: TItem[], pageIndex: number) => void | Promise<void>;
    maxPages?: number;
    stopOnError?: boolean;
    onError?: (error: unknown, pageIndex: number) => void | Promise<void>;
    signal?: AbortSignal;
}

export interface AskOptions<TResponse, TResult> {
    request: (context: { attempt: number; signal?: AbortSignal }) => Promise<TResponse>;
    until: (response: TResponse, attempt: number) => TResult | null | undefined | false;
    intervalMs?: number;
    maxAttempts?: number;
    timeoutMs?: number;
    signal?: AbortSignal;
}

export interface QueryParamInjectionField {
    sourceKeys: string[];
    targetKey?: string;
}

export interface QueryParamInjectionMiddlewareOptions {
    enabled?: boolean;
    isEnabled?: () => boolean;
    fields: QueryParamInjectionField[];
    includeMethods?: string[];
}

export interface SidUserIdMiddlewareOptions {
    enabled?: boolean;
    isEnabled?: () => boolean;
    sidParamKeys?: string[];
    userIdParamKeys?: string[];
    sidField?: string;
    userIdField?: string;
    includeMethods?: string[];
}

export interface MockRequestMiddlewareOptions {
    mockBaseURL: string;
    enabled?: boolean;
    shouldMock?: (context: RequestContext) => boolean | Promise<boolean>;
}

export interface LegacyRequestAdapterOptions<TFallbackData = unknown> {
    useReject?: boolean;
    fixFetchError?: boolean;
    fallbackCode?: number;
    fallbackMsg?: string;
    fallbackData?: TFallbackData;
}

export interface LegacyErrorFallback<T = unknown> {
    state: {
        code: number;
        msg: string;
    };
    data: T;
}

/** HTTP 层错误（2xx 之外） */
export class HttpError extends Error {
    constructor(
        public readonly status: number,
        message: string,
        public readonly raw?: unknown,
    ) {
        super(message);
        this.name = "HttpError";
    }
}

export class ApiError extends Error {
    constructor(
        public readonly code: number,
        message: string,
        public readonly data?: unknown,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export class TimeoutError extends Error {
    constructor(
        public readonly timeoutMs: number,
        message = `Request timeout after ${timeoutMs}ms`,
    ) {
        super(message);
        this.name = "TimeoutError";
    }
}

/** 将对象参数序列化为 query string，兼容路径已有 query string 的情况 */
function appendQuery(path: string, params?: QueryParams): string {
    if (!params) return path;
    const qIndex = path.indexOf("?");
    const pathname = qIndex === -1 ? path : path.slice(0, qIndex);
    const existingSearch = qIndex === -1 ? "" : path.slice(qIndex + 1);
    const qs = new URLSearchParams(existingSearch);
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) qs.set(k, String(v));
    }
    const str = qs.toString();
    return str ? `${pathname}?${str}` : pathname;
}

/** 拼接 baseURL 与路径，处理斜杠边界 */
function joinUrl(baseURL: string, path: string): string {
    if (path.startsWith("http")) return path;
    if (!baseURL) return path;
    if (!path) return baseURL;
    if (baseURL.endsWith("/") && path.startsWith("/")) {
        return `${baseURL}${path.slice(1)}`;
    }
    if (!baseURL.endsWith("/") && !path.startsWith("/")) {
        return `${baseURL}/${path}`;
    }
    return `${baseURL}${path}`;
}

function joinPathPrefix(prefix: string, path: string): string {
    if (!prefix) return path;
    if (!path) return prefix;
    if (path.startsWith("http")) return path;
    if (prefix.endsWith("/") && path.startsWith("/")) {
        return `${prefix}${path.slice(1)}`;
    }
    if (!prefix.endsWith("/") && !path.startsWith("/")) {
        return `${prefix}/${path}`;
    }
    return `${prefix}${path}`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return Object.prototype.toString.call(value) === "[object Object]";
}

function readQueryParam(keys: string[]): string {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    for (const key of keys) {
        const value = params.get(key);
        if (value) return value;
    }
    return "";
}

export function createQueryParamInjectionMiddleware(
    options: QueryParamInjectionMiddlewareOptions,
): HttpMiddleware {
    const {
        enabled = true,
        isEnabled,
        fields,
        includeMethods = ["GET", "HEAD", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"],
    } = options;
    const allowMethods = new Set(includeMethods.map((method) => method.toUpperCase()));
    const resolvePayload = () => {
        const payload: Record<string, string> = {};
        for (const field of fields) {
            const value = readQueryParam(field.sourceKeys);
            if (!value) continue;
            const targetKey = field.targetKey ?? field.sourceKeys[0];
            if (!targetKey) continue;
            payload[targetKey] = value;
        }
        return payload;
    };
    return {
        async onRequest(context) {
            if (!enabled) return;
            if (isEnabled && !isEnabled()) return;
            const payload = resolvePayload();
            const entries = Object.entries(payload);
            if (entries.length === 0) return;
            const upperMethod = context.request.method.toUpperCase();
            if (!allowMethods.has(upperMethod)) return;
            if (upperMethod === "GET" || upperMethod === "HEAD" || upperMethod === "OPTIONS") {
                return { url: appendQuery(context.request.url, payload) };
            }
            if (context.request.body instanceof FormData) {
                const nextFormData = new FormData();
                for (const [key, value] of context.request.body.entries()) {
                    nextFormData.append(key, value);
                }
                for (const [key, value] of entries) {
                    if (!nextFormData.has(key)) {
                        nextFormData.append(key, value);
                    }
                }
                return { body: nextFormData };
            }
            if (!context.request.body) {
                return { body: payload };
            }
            if (isPlainObject(context.request.body)) {
                return {
                    body: {
                        ...payload,
                        ...context.request.body,
                    },
                };
            }
        },
    };
}

export function createSidUserIdMiddleware(
    options: SidUserIdMiddlewareOptions = {},
): HttpMiddleware {
    const {
        enabled = true,
        isEnabled,
        sidParamKeys = ["sid"],
        userIdParamKeys = ["userId", "userid"],
        sidField = "sid",
        userIdField = "userId",
        includeMethods = ["GET", "HEAD", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"],
    } = options;
    return createQueryParamInjectionMiddleware({
        enabled,
        isEnabled,
        includeMethods,
        fields: [
            {
                sourceKeys: sidParamKeys,
                targetKey: sidField,
            },
            {
                sourceKeys: userIdParamKeys,
                targetKey: userIdField,
            },
        ],
    });
}

export function createMockRequestMiddleware(options: MockRequestMiddlewareOptions): HttpMiddleware {
    const { mockBaseURL, enabled = true, shouldMock } = options;
    return {
        async onRequest(context) {
            if (!enabled) return;
            if (shouldMock && !(await shouldMock(context))) return;
            const qIndex = context.request.url.indexOf("?");
            const pathOnly =
                qIndex === -1 ? context.request.url : context.request.url.slice(0, qIndex);
            const queryOnly = qIndex === -1 ? "" : context.request.url.slice(qIndex);
            const rawPath = pathOnly.startsWith("http")
                ? (() => {
                      const parsed = new URL(pathOnly);
                      return parsed.pathname;
                  })()
                : pathOnly;
            return { url: `${joinUrl(mockBaseURL, rawPath)}${queryOnly}` };
        },
    };
}

export async function adaptLegacyRequest<T, TFallbackData = unknown>(
    request: Promise<T>,
    options: LegacyRequestAdapterOptions<TFallbackData> = {},
): Promise<T | LegacyErrorFallback<TFallbackData>> {
    const {
        useReject = true,
        fixFetchError = false,
        fallbackCode = 444444,
        fallbackMsg = "请求接口失败",
        fallbackData,
    } = options;
    if (useReject && !fixFetchError) {
        return request;
    }
    try {
        return await request;
    } catch (error) {
        if (useReject) {
            throw error;
        }
        if (fixFetchError) {
            return {
                state: {
                    code: fallbackCode,
                    msg: fallbackMsg,
                },
                data: fallbackData as TFallbackData,
            };
        }
        throw error;
    }
}

/** 尝试从错误响应中提取可读 message */
function parseMessage(raw: unknown, fallback: string): string {
    if (!raw || typeof raw !== "object") return fallback;
    const rec = raw as Record<string, unknown>;
    if (typeof rec.msg === "string" && rec.msg) return rec.msg;
    if (typeof rec.message === "string" && rec.message) return rec.message;
    if (typeof rec.error === "string" && rec.error) return rec.error;
    return fallback;
}

/** 根据 body 类型自动决定是否 JSON.stringify，并补充 Content-Type */
function resolveBody(
    body: unknown,
    currentHeaders: Record<string, string>,
): { body: BodyInit | undefined; headers: Record<string, string> } {
    if (body === undefined) {
        return { body: undefined, headers: currentHeaders };
    }

    if (
        typeof body === "string" ||
        body instanceof FormData ||
        body instanceof URLSearchParams ||
        body instanceof Blob ||
        body instanceof ArrayBuffer ||
        ArrayBuffer.isView(body)
    ) {
        return { body: body as BodyInit, headers: currentHeaders };
    }

    return {
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            ...currentHeaders,
        },
    };
}

/** 将各种 HeadersInit 格式统一为 Record<string, string> */
function normalizeHeaders(headers: HeadersInit | undefined): Record<string, string> {
    if (!headers) return {};
    if (headers instanceof Headers) {
        const result: Record<string, string> = {};
        headers.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }
    if (Array.isArray(headers)) {
        const result: Record<string, string> = {};
        for (const [key, value] of headers) {
            result[key] = value;
        }
        return result;
    }
    return { ...headers } as Record<string, string>;
}

type BodylessOptions = Omit<RequestOptions, "body" | "method">;
type BodyOptions = Omit<RequestOptions, "method">;

export interface HttpClient {
    get(path: string, options: BodylessOptions & { streaming: true }): Promise<Response>;
    get<T>(path: string, options?: BodylessOptions): Promise<T>;
    post(
        path: string,
        body?: unknown,
        options?: BodylessOptions & { streaming: true },
    ): Promise<Response>;
    post<T>(path: string, body?: unknown, options?: BodylessOptions): Promise<T>;
    put(
        path: string,
        body?: unknown,
        options?: BodylessOptions & { streaming: true },
    ): Promise<Response>;
    put<T>(path: string, body?: unknown, options?: BodylessOptions): Promise<T>;
    patch(
        path: string,
        body?: unknown,
        options?: BodylessOptions & { streaming: true },
    ): Promise<Response>;
    patch<T>(path: string, body?: unknown, options?: BodylessOptions): Promise<T>;
    delete(path: string, options?: BodyOptions & { streaming: true }): Promise<Response>;
    delete<T>(path: string, options?: BodyOptions): Promise<T>;
}

const DEFAULT_RETRY_OPTIONS: Required<
    Omit<RetryOptions, "retryableMethods" | "shouldRetry" | "retryableStatusCodes" | "isIdempotent">
> &
    Pick<RetryOptions, "retryableMethods" | "shouldRetry" | "retryableStatusCodes"> = {
    retries: 0,
    retryDelayMs: 300,
    maxRetryDelayMs: 3000,
    backoffFactor: 2,
    jitter: true,
    retryableStatusCodes: [408, 425, 429, 500, 502, 503, 504],
    retryableMethods: ["GET", "HEAD", "OPTIONS", "PUT", "DELETE"],
    shouldRetry: undefined,
};

const DEFAULT_DEDUPE_OPTIONS: Omit<Required<DedupeOptions>, "key"> & Pick<DedupeOptions, "key"> = {
    enabled: false,
    methods: ["GET"],
    key: undefined,
};

const MAX_GET_CACHE_SIZE = 1000;

const DEFAULT_GET_CACHE_OPTIONS: Omit<Required<GetCacheOptions>, "key" | "storage"> &
    Pick<GetCacheOptions, "key" | "storage"> = {
    enabled: false,
    ttlMs: 5000,
    maxSize: MAX_GET_CACHE_SIZE,
    methods: ["GET"],
    key: undefined,
    storage: undefined,
};

const DEFAULT_CONCURRENCY_OPTIONS: Required<ConcurrencyOptions> = {
    enabled: false,
    maxConcurrent: 6,
};

const DEFAULT_SENSITIVE_FIELDS: Required<SensitiveFields> = {
    headers: ["authorization", "cookie", "set-cookie", "x-api-key"],
    body: ["password", "token", "accessToken", "refreshToken", "secret"],
    mask: "***",
};

const DEFAULT_FAILOVER_OPTIONS: Required<FailoverOptions> = {
    switchOnStatusCodes: [502, 503, 504],
    switchOnNetworkError: true,
    switchOnTimeout: true,
};

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function sleepWithSignal(ms: number, signal?: AbortSignal): Promise<void> {
    if (ms <= 0) {
        return Promise.resolve();
    }
    if (signal?.aborted) {
        return Promise.reject(new DOMException("Aborted", "AbortError"));
    }
    return new Promise((resolve, reject) => {
        const onAbort = () => {
            clearTimeout(timer);
            if (signal) {
                signal.removeEventListener("abort", onAbort);
            }
            reject(new DOMException("Aborted", "AbortError"));
        };
        if (signal) {
            signal.addEventListener("abort", onAbort, { once: true });
        }
        const timer = setTimeout(() => {
            if (signal) {
                signal.removeEventListener("abort", onAbort);
            }
            resolve();
        }, ms);
    });
}

export async function loopRequest<TPage, TItem>(
    options: LoopRequestOptions<TPage, TItem>,
): Promise<TItem[]> {
    const {
        request,
        extractItems,
        hasMore,
        advance,
        maxPages = Number.POSITIVE_INFINITY,
        stopOnError = true,
        onError,
        signal,
    } = options;
    const allItems: TItem[] = [];
    for (let pageIndex = 1; pageIndex <= maxPages; pageIndex += 1) {
        if (signal?.aborted) {
            throw new DOMException("Aborted", "AbortError");
        }
        try {
            const page = await request({ pageIndex, signal });
            const items = extractItems(page) ?? [];
            allItems.push(...items);
            const shouldContinue = hasMore
                ? hasMore(page, items, pageIndex, allItems)
                : items.length > 0;
            if (!shouldContinue) {
                break;
            }
            if (advance) {
                await advance(page, items, pageIndex);
            }
        } catch (error) {
            if (onError) {
                await onError(error, pageIndex);
            }
            if (stopOnError) {
                throw error;
            }
            break;
        }
    }
    return allItems;
}

export async function askUntil<TResponse, TResult>(
    options: AskOptions<TResponse, TResult>,
): Promise<TResult> {
    const {
        request,
        until,
        intervalMs = 5000,
        maxAttempts = Number.POSITIVE_INFINITY,
        timeoutMs,
        signal,
    } = options;
    const startedAt = Date.now();
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        if (signal?.aborted) {
            throw new DOMException("Aborted", "AbortError");
        }
        if (timeoutMs && timeoutMs > 0 && Date.now() - startedAt >= timeoutMs) {
            throw new TimeoutError(timeoutMs, `Polling timeout after ${timeoutMs}ms`);
        }
        const remainingMs =
            timeoutMs && timeoutMs > 0
                ? Math.max(0, timeoutMs - (Date.now() - startedAt))
                : undefined;
        if (typeof remainingMs === "number" && remainingMs <= 0) {
            throw new TimeoutError(timeoutMs ?? 0, `Polling timeout after ${timeoutMs}ms`);
        }
        const timeoutSignal = createAbortSignal(signal, remainingMs);
        let response: TResponse;
        try {
            response = await request({ attempt, signal: timeoutSignal.signal });
        } catch (error) {
            if (timeoutSignal.didTimeout() && isAbortError(error)) {
                throw new TimeoutError(timeoutMs ?? 0, `Polling timeout after ${timeoutMs}ms`);
            }
            throw error;
        } finally {
            timeoutSignal.cleanup();
        }
        const result = until(response, attempt);
        if (result !== false && result !== undefined && result !== null) {
            return result as TResult;
        }
        if (attempt >= maxAttempts) {
            break;
        }
        let waitMs = intervalMs;
        if (timeoutMs && timeoutMs > 0) {
            const remainingMs = timeoutMs - (Date.now() - startedAt);
            if (remainingMs <= 0) {
                throw new TimeoutError(timeoutMs ?? 0, `Polling timeout after ${timeoutMs}ms`);
            }
            waitMs = Math.min(waitMs, remainingMs);
        }
        await sleepWithSignal(waitMs, signal);
    }
    throw new Error("Polling condition not met");
}

function isAbortError(error: unknown): boolean {
    return error instanceof DOMException && error.name === "AbortError";
}

function createAbortSignal(signal?: AbortSignal, timeoutMs?: number) {
    if (!timeoutMs || timeoutMs <= 0) {
        return {
            signal,
            cleanup: () => {},
            didTimeout: () => false,
        };
    }

    const controller = new AbortController();
    let isTimedOut = false;
    const onAbort = () => {
        controller.abort();
    };

    if (signal) {
        if (signal.aborted) {
            controller.abort();
        } else {
            signal.addEventListener("abort", onAbort, { once: true });
        }
    }

    const timer = setTimeout(() => {
        isTimedOut = true;
        controller.abort();
    }, timeoutMs);

    return {
        signal: controller.signal,
        cleanup: () => {
            clearTimeout(timer);
            if (signal) signal.removeEventListener("abort", onAbort);
        },
        didTimeout: () => isTimedOut,
    };
}

function normalizeRetryOptions(
    clientRetry: RetryOptions | false | undefined,
    requestRetry: Partial<RetryOptions> | false | undefined,
): RetryOptions | false {
    if (clientRetry === false || requestRetry === false) return false;
    return {
        ...DEFAULT_RETRY_OPTIONS,
        ...(clientRetry ?? {}),
        ...(requestRetry ?? {}),
    };
}

function normalizeDedupeOptions(
    clientDedupe: DedupeOptions | false | undefined,
    requestDedupe: Partial<DedupeOptions> | false | undefined,
): DedupeOptions | false {
    if (clientDedupe === false || requestDedupe === false) return false;
    return {
        ...DEFAULT_DEDUPE_OPTIONS,
        ...(clientDedupe ?? {}),
        ...(requestDedupe ?? {}),
    };
}

function normalizeGetCacheOptions(
    clientGetCache: GetCacheOptions | false | undefined,
    requestGetCache: Partial<GetCacheOptions> | false | undefined,
): GetCacheOptions | false {
    if (clientGetCache === false || requestGetCache === false) return false;
    return {
        ...DEFAULT_GET_CACHE_OPTIONS,
        ...(clientGetCache ?? {}),
        ...(requestGetCache ?? {}),
    };
}

function normalizeConcurrencyOptions(
    clientConcurrency: ConcurrencyOptions | false | undefined,
    requestConcurrency: Partial<ConcurrencyOptions> | false | undefined,
): ConcurrencyOptions | false {
    if (clientConcurrency === false || requestConcurrency === false) return false;
    return {
        ...DEFAULT_CONCURRENCY_OPTIONS,
        ...(clientConcurrency ?? {}),
        ...(requestConcurrency ?? {}),
    };
}

function normalizeFailoverOptions(
    clientFailover: FailoverOptions | false | undefined,
    requestFailover: Partial<FailoverOptions> | false | undefined,
): FailoverOptions | false {
    if (clientFailover === false || requestFailover === false) return false;
    return {
        ...DEFAULT_FAILOVER_OPTIONS,
        ...(clientFailover ?? {}),
        ...(requestFailover ?? {}),
    };
}

function computeRetryDelay(attempt: number, retry: RetryOptions): number {
    const retryDelayMs = retry.retryDelayMs ?? DEFAULT_RETRY_OPTIONS.retryDelayMs;
    const maxRetryDelayMs = retry.maxRetryDelayMs ?? DEFAULT_RETRY_OPTIONS.maxRetryDelayMs;
    const backoffFactor = retry.backoffFactor ?? DEFAULT_RETRY_OPTIONS.backoffFactor;
    const jitter = retry.jitter ?? DEFAULT_RETRY_OPTIONS.jitter;

    const raw = retryDelayMs * backoffFactor ** Math.max(0, attempt - 1);
    const capped = Math.min(raw, maxRetryDelayMs);
    if (!jitter) return capped;
    return Math.floor(capped * (0.5 + Math.random() * 0.5));
}

function isRetryableError(error: unknown): boolean {
    if (error instanceof TimeoutError) return true;
    if (error instanceof TypeError) return true;
    if (isAbortError(error)) return false;
    return false;
}

function isRetryableStatus(error: unknown, retry: RetryOptions): boolean {
    if (!(error instanceof HttpError)) return false;
    return (
        retry.retryableStatusCodes ??
        DEFAULT_RETRY_OPTIONS.retryableStatusCodes ??
        []
    ).includes(error.status);
}

function isRetryableMethod(method: string, retry: RetryOptions): boolean {
    const methods = retry.retryableMethods ?? DEFAULT_RETRY_OPTIONS.retryableMethods ?? [];
    return methods.includes(method.toUpperCase());
}

function isMethodEnabled(method: string, methods?: string[]): boolean {
    if (!methods || methods.length === 0) return false;
    return methods.includes(method.toUpperCase());
}

function normalizeSensitiveFields(
    clientFields?: SensitiveFields,
    requestFields?: Partial<SensitiveFields>,
): Required<SensitiveFields> {
    return {
        headers: Array.from(
            new Set([
                ...DEFAULT_SENSITIVE_FIELDS.headers,
                ...(clientFields?.headers ?? []),
                ...(requestFields?.headers ?? []),
            ]),
        ),
        body: Array.from(
            new Set([
                ...DEFAULT_SENSITIVE_FIELDS.body,
                ...(clientFields?.body ?? []),
                ...(requestFields?.body ?? []),
            ]),
        ),
        mask: requestFields?.mask ?? clientFields?.mask ?? DEFAULT_SENSITIVE_FIELDS.mask,
    };
}

function redactHeaders(
    headers: Record<string, string>,
    fields: Required<SensitiveFields>,
): Record<string, string> {
    const sensitiveSet = new Set(fields.headers.map((item) => item.toLowerCase()));
    const nextHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
        nextHeaders[key] = sensitiveSet.has(key.toLowerCase()) ? fields.mask : value;
    }
    return nextHeaders;
}

function redactBodyValue(
    input: unknown,
    sensitiveSet: Set<string>,
    mask: string,
    visited: WeakSet<object>,
): unknown {
    if (input === null || input === undefined) return input;
    if (typeof input !== "object") return input;
    if (input instanceof Blob || input instanceof ArrayBuffer || ArrayBuffer.isView(input)) {
        return input;
    }
    if (typeof FormData !== "undefined" && input instanceof FormData) {
        const result: Record<string, unknown> = {};
        for (const [key, value] of input.entries()) {
            result[key] = sensitiveSet.has(key.toLowerCase()) ? mask : value;
        }
        return result;
    }
    if (typeof URLSearchParams !== "undefined" && input instanceof URLSearchParams) {
        const result: Record<string, string> = {};
        for (const [key, value] of input.entries()) {
            result[key] = sensitiveSet.has(key.toLowerCase()) ? mask : value;
        }
        return result;
    }
    if (visited.has(input as object)) return "[Circular]";
    visited.add(input as object);
    if (Array.isArray(input)) {
        return input.map((item) => redactBodyValue(item, sensitiveSet, mask, visited));
    }
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
        result[key] = sensitiveSet.has(key.toLowerCase())
            ? mask
            : redactBodyValue(value, sensitiveSet, mask, visited);
    }
    return result;
}

export function redactSensitiveData(
    headers: Record<string, string>,
    body: unknown,
    fields?: SensitiveFields,
): { headers: Record<string, string>; body: unknown } {
    const normalized = normalizeSensitiveFields(fields);
    return {
        headers: redactHeaders(headers, normalized),
        body: redactBodyValue(
            body,
            new Set(normalized.body.map((item) => item.toLowerCase())),
            normalized.mask,
            new WeakSet<object>(),
        ),
    };
}

function shouldSwitchBase(error: unknown, failover: FailoverOptions): boolean {
    if (error instanceof TimeoutError) {
        return failover.switchOnTimeout ?? DEFAULT_FAILOVER_OPTIONS.switchOnTimeout;
    }
    if (error instanceof TypeError) {
        return failover.switchOnNetworkError ?? DEFAULT_FAILOVER_OPTIONS.switchOnNetworkError;
    }
    if (error instanceof HttpError) {
        const statusCodes =
            failover.switchOnStatusCodes ?? DEFAULT_FAILOVER_OPTIONS.switchOnStatusCodes;
        return statusCodes.includes(error.status);
    }
    return false;
}

async function parseResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) return undefined as T;
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
        return (await response.json()) as T;
    }
    return (await response.text()) as T;
}

function isEnvelope(payload: unknown): payload is { code: number; msg?: string; data: unknown } {
    if (!payload || typeof payload !== "object") return false;
    const record = payload as Record<string, unknown>;
    return typeof record.code === "number" && "data" in record;
}

/** 创建可复用 HTTP 客户端 */
export function createHttpClient(options: HttpClientOptions = {}): HttpClient {
    const {
        baseURL = "",
        fallbackBaseURLs: defaultFallbackBaseURLs = [],
        servicePrefixes = {},
        defaultServicePrefix,
        credentials,
        headers: defaultHeaders = {},
        onUnauthorized,
        timeoutMs: defaultTimeoutMs,
        retry: defaultRetry,
        failover: defaultFailover,
        sensitiveFields: defaultSensitiveFields,
        dedupe: defaultDedupe,
        getCache: defaultGetCache,
        concurrency: defaultConcurrency,
        middlewares = [],
        envelope,
    } = options;
    const envelopeEnabled = envelope?.enabled ?? false;
    const successCodes = envelope?.successCodes ?? [0, 200];
    const resolvedDefaultSensitiveFields = normalizeSensitiveFields(defaultSensitiveFields);
    const inflightRequests = new Map<string, Promise<unknown>>();
    const internalGetCacheStorage = new Map<string, GetCacheEntry>();
    const pendingConcurrencyQueue: Array<() => void> = [];
    let activeConcurrencyCount = 0;

    async function withConcurrency<T>(
        concurrencyOptions: ConcurrencyOptions | false,
        task: () => Promise<T>,
    ): Promise<T> {
        const enabled =
            concurrencyOptions !== false &&
            (concurrencyOptions.enabled ?? DEFAULT_CONCURRENCY_OPTIONS.enabled);
        if (!enabled) {
            return task();
        }
        const maxConcurrent = Math.max(
            1,
            concurrencyOptions.maxConcurrent ?? DEFAULT_CONCURRENCY_OPTIONS.maxConcurrent,
        );
        if (activeConcurrencyCount >= maxConcurrent) {
            await new Promise<void>((resolve) => {
                pendingConcurrencyQueue.push(resolve);
            });
        }
        activeConcurrencyCount += 1;
        try {
            return await task();
        } finally {
            activeConcurrencyCount -= 1;
            const next = pendingConcurrencyQueue.shift();
            if (next) next();
        }
    }

    async function request(
        method: string,
        path: string,
        options: RequestOptions & { streaming: true },
    ): Promise<Response>;
    async function request<T = unknown>(
        method: string,
        path: string,
        options?: RequestOptions,
    ): Promise<T>;
    async function request<T = unknown>(
        method: string,
        path: string,
        options: RequestOptions = {},
    ): Promise<T | Response> {
        const {
            body,
            params,
            headers: extraHeaders,
            signal,
            servicePrefix,
            disableServicePrefix,
            timeoutMs,
            retry,
            fallbackBaseURLs = [],
            failover,
            streaming = false,
            sensitiveFields,
            dedupe,
            getCache,
            concurrency,
            ...rest
        } = options;
        const resolvedPrefix = disableServicePrefix
            ? ""
            : ((servicePrefix ? (servicePrefixes[servicePrefix] ?? servicePrefix) : undefined) ??
              defaultServicePrefix ??
              "");
        const prefixedPath = resolvedPrefix ? joinPathPrefix(resolvedPrefix, path) : path;
        const retryOptions = normalizeRetryOptions(defaultRetry, retry);
        const failoverOptions = normalizeFailoverOptions(defaultFailover, failover);
        const dedupeOptions = normalizeDedupeOptions(defaultDedupe, dedupe);
        const getCacheOptions = normalizeGetCacheOptions(defaultGetCache, getCache);
        const resolvedGetCacheOptions = getCacheOptions === false ? undefined : getCacheOptions;
        const concurrencyOptions = normalizeConcurrencyOptions(defaultConcurrency, concurrency);
        const totalAttempts =
            retryOptions === false
                ? 1
                : 1 + (retryOptions.retries ?? DEFAULT_RETRY_OPTIONS.retries);
        const headers: Record<string, string> = {
            ...defaultHeaders,
            ...normalizeHeaders(extraHeaders),
        };
        const hasMiddlewares = middlewares.length > 0;
        const requestKeyContext: RequestContext = {
            method,
            path: prefixedPath,
            url: appendQuery(prefixedPath, params),
            attempt: 1,
            options,
            request: {
                method,
                path: prefixedPath,
                url: appendQuery(prefixedPath, params),
                headers,
                body,
                credentials,
            },
            safeHeaders: headers,
            safeBody: body,
        };
        const dedupeEnabled =
            dedupeOptions !== false &&
            (dedupeOptions.enabled ?? DEFAULT_DEDUPE_OPTIONS.enabled) &&
            !streaming &&
            isMethodEnabled(method, dedupeOptions.methods ?? DEFAULT_DEDUPE_OPTIONS.methods);
        const dedupeKey = dedupeEnabled
            ? (dedupeOptions.key?.(requestKeyContext) ??
              `${method.toUpperCase()}::${appendQuery(prefixedPath, params)}`)
            : undefined;
        const getCacheEnabled =
            getCacheOptions !== false &&
            (getCacheOptions.enabled ?? DEFAULT_GET_CACHE_OPTIONS.enabled) &&
            !streaming &&
            isMethodEnabled(method, getCacheOptions.methods ?? DEFAULT_GET_CACHE_OPTIONS.methods);
        const getCacheKey = getCacheEnabled
            ? (getCacheOptions.key?.(requestKeyContext) ??
              `${method.toUpperCase()}::${appendQuery(prefixedPath, params)}`)
            : undefined;
        const getCacheStorage =
            getCacheEnabled && resolvedGetCacheOptions
                ? (resolvedGetCacheOptions.storage ?? internalGetCacheStorage)
                : undefined;
        if (getCacheEnabled && getCacheStorage && getCacheKey) {
            const cacheEntry = getCacheStorage.get(getCacheKey);
            if (cacheEntry && cacheEntry.expiresAt > Date.now()) {
                return cacheEntry.data as T;
            }
            if (cacheEntry) {
                getCacheStorage.delete(getCacheKey);
            }
        }
        if (dedupeEnabled && dedupeKey) {
            const existingRequest = inflightRequests.get(dedupeKey);
            if (existingRequest) {
                return (await existingRequest) as T;
            }
        }

        const executeRequest = async () => {
            const resolvedSensitiveFields = hasMiddlewares
                ? sensitiveFields
                    ? normalizeSensitiveFields(resolvedDefaultSensitiveFields, sensitiveFields)
                    : resolvedDefaultSensitiveFields
                : undefined;
            const safePayload = hasMiddlewares
                ? redactSensitiveData(headers, body, resolvedSensitiveFields)
                : { headers, body };
            const baseCandidates = Array.from(
                new Set([baseURL, ...defaultFallbackBaseURLs, ...fallbackBaseURLs].filter(Boolean)),
            );
            let lastError: unknown;

            for (
                let baseIndex = 0;
                baseIndex < Math.max(baseCandidates.length, 1);
                baseIndex += 1
            ) {
                const selectedBaseURL = baseCandidates[baseIndex] ?? "";
                const url = appendQuery(joinUrl(selectedBaseURL, prefixedPath), params);

                for (let attempt = 1; attempt <= totalAttempts; attempt += 1) {
                    const requestContext: RequestContext = {
                        method,
                        path: prefixedPath,
                        url,
                        attempt,
                        options,
                        request: {
                            method,
                            path: prefixedPath,
                            url,
                            headers,
                            body,
                            credentials,
                        },
                        safeHeaders: safePayload.headers,
                        safeBody: safePayload.body,
                    };
                    const startedAt = Date.now();

                    try {
                        let hasMutation = false;
                        for (const middleware of middlewares) {
                            if (middleware.onRequest) {
                                const mutation = await middleware.onRequest(requestContext);
                                if (mutation) {
                                    hasMutation = true;
                                    if (mutation.method !== undefined) {
                                        requestContext.request.method = mutation.method;
                                        requestContext.method = mutation.method;
                                    }
                                    if (mutation.path !== undefined) {
                                        requestContext.request.path = mutation.path;
                                        requestContext.path = mutation.path;
                                    }
                                    if (mutation.url !== undefined) {
                                        requestContext.request.url = mutation.url;
                                        requestContext.url = mutation.url;
                                    }
                                    if (mutation.headers !== undefined) {
                                        requestContext.request.headers = mutation.headers;
                                    }
                                    if (mutation.body !== undefined) {
                                        requestContext.request.body = mutation.body;
                                    }
                                    if (mutation.credentials !== undefined) {
                                        requestContext.request.credentials = mutation.credentials;
                                    }
                                }
                            }
                        }
                        if (hasMutation && hasMiddlewares && resolvedSensitiveFields) {
                            const runtimeSafePayload = redactSensitiveData(
                                requestContext.request.headers,
                                requestContext.request.body,
                                resolvedSensitiveFields,
                            );
                            requestContext.safeHeaders = runtimeSafePayload.headers;
                            requestContext.safeBody = runtimeSafePayload.body;
                        }

                        // 序列化 body 只在 fetch 前执行，中间件拿到的始终是原始对象
                        const finalRequestBody = resolveBody(
                            requestContext.request.body,
                            requestContext.request.headers,
                        );

                        const response = await withConcurrency(concurrencyOptions, async () => {
                            const timeoutSignal = createAbortSignal(
                                signal,
                                timeoutMs ?? defaultTimeoutMs,
                            );
                            try {
                                return await fetch(requestContext.request.url, {
                                    ...rest,
                                    method: requestContext.request.method,
                                    headers: finalRequestBody.headers,
                                    signal: timeoutSignal.signal,
                                    credentials: requestContext.request.credentials,
                                    body: finalRequestBody.body,
                                });
                            } catch (fetchError) {
                                if (timeoutSignal.didTimeout() && isAbortError(fetchError)) {
                                    throw new TimeoutError(timeoutMs ?? defaultTimeoutMs ?? 0);
                                }
                                throw fetchError;
                            } finally {
                                timeoutSignal.cleanup();
                            }
                        });

                        if (response.status === 401 && onUnauthorized) {
                            await onUnauthorized(response);
                        }

                        if (!response.ok) {
                            let raw: unknown;
                            try {
                                raw = await response.clone().json();
                            } catch {
                                try {
                                    raw = await response.text();
                                } catch {
                                    raw = undefined;
                                }
                            }
                            const fallback = `HTTP ${response.status}: ${response.statusText}`;
                            throw new HttpError(response.status, parseMessage(raw, fallback), raw);
                        }

                        if (streaming) {
                            const responseContext: ResponseContext = {
                                ...requestContext,
                                response,
                                durationMs: Date.now() - startedAt,
                            };
                            for (const middleware of middlewares) {
                                if (middleware.onResponse) {
                                    await middleware.onResponse(responseContext);
                                }
                            }
                            return response;
                        }

                        const payload = await parseResponse<unknown>(response);
                        const finalData =
                            envelopeEnabled && isEnvelope(payload)
                                ? (() => {
                                      if (!successCodes.includes(payload.code)) {
                                          throw new ApiError(
                                              payload.code,
                                              payload.msg ?? `API code ${payload.code}`,
                                              payload.data,
                                          );
                                      }
                                      return payload.data as T;
                                  })()
                                : (payload as T);

                        const responseContext: ResponseContext = {
                            ...requestContext,
                            response,
                            durationMs: Date.now() - startedAt,
                        };
                        for (const middleware of middlewares) {
                            if (middleware.onResponse) {
                                await middleware.onResponse(responseContext);
                            }
                        }

                        return finalData;
                    } catch (error) {
                        lastError = error;

                        const errorContext: ErrorContext = {
                            ...requestContext,
                            error,
                            durationMs: Date.now() - startedAt,
                        };
                        for (const middleware of middlewares) {
                            if (middleware.onError) {
                                await middleware.onError(errorContext);
                            }
                        }

                        const canRetry =
                            retryOptions !== false &&
                            attempt < totalAttempts &&
                            (retryOptions.isIdempotent
                                ? await retryOptions.isIdempotent({
                                      method: requestContext.request.method,
                                      path: requestContext.request.path,
                                      options,
                                  })
                                : isRetryableMethod(requestContext.request.method, retryOptions)) &&
                            (isRetryableError(error) || isRetryableStatus(error, retryOptions));
                        const allowByCustom =
                            retryOptions !== false && retryOptions.shouldRetry
                                ? await retryOptions.shouldRetry({
                                      attempt,
                                      method: requestContext.request.method,
                                      path: requestContext.request.path,
                                      error,
                                  })
                                : true;

                        if (canRetry && allowByCustom) {
                            await sleep(computeRetryDelay(attempt, retryOptions as RetryOptions));
                            continue;
                        }

                        const hasNextBase = baseIndex < Math.max(baseCandidates.length, 1) - 1;
                        const canSwitchBase =
                            hasNextBase &&
                            failoverOptions !== false &&
                            shouldSwitchBase(error, failoverOptions);

                        if (canSwitchBase) {
                            break;
                        }

                        throw error;
                    }
                }
            }

            if (lastError) {
                throw lastError;
            }
            throw new Error("request failed");
        };

        const executionPromise = executeRequest();
        if (dedupeEnabled && dedupeKey) {
            inflightRequests.set(dedupeKey, executionPromise);
        }
        try {
            const result = await executionPromise;
            if (getCacheEnabled && getCacheStorage && getCacheKey && !streaming) {
                const ttlMs = Math.max(
                    0,
                    resolvedGetCacheOptions?.ttlMs ?? DEFAULT_GET_CACHE_OPTIONS.ttlMs,
                );
                const maxSize = Math.max(
                    1,
                    resolvedGetCacheOptions?.maxSize ?? DEFAULT_GET_CACHE_OPTIONS.maxSize,
                );
                if (ttlMs > 0) {
                    if (getCacheStorage.size >= maxSize) {
                        const now = Date.now();
                        for (const [k, entry] of getCacheStorage) {
                            if (entry.expiresAt <= now) getCacheStorage.delete(k);
                        }
                        while (getCacheStorage.size >= maxSize) {
                            const oldestKey = getCacheStorage.keys().next().value as
                                | string
                                | undefined;
                            if (!oldestKey) break;
                            getCacheStorage.delete(oldestKey);
                        }
                    }
                    getCacheStorage.set(getCacheKey, {
                        data: result,
                        expiresAt: Date.now() + ttlMs,
                    });
                }
            }
            return result;
        } finally {
            if (dedupeEnabled && dedupeKey) {
                inflightRequests.delete(dedupeKey);
            }
        }
    }

    function get(path: string, options: BodylessOptions & { streaming: true }): Promise<Response>;
    function get<T>(path: string, options?: BodylessOptions): Promise<T>;
    function get<T>(path: string, options?: BodylessOptions) {
        return request<T>("GET", path, options);
    }

    function post(
        path: string,
        body?: unknown,
        options?: BodylessOptions & { streaming: true },
    ): Promise<Response>;
    function post<T>(path: string, body?: unknown, options?: BodylessOptions): Promise<T>;
    function post<T>(path: string, body?: unknown, options?: BodylessOptions) {
        return request<T>("POST", path, { ...options, body } as BodyOptions);
    }

    function put(
        path: string,
        body?: unknown,
        options?: BodylessOptions & { streaming: true },
    ): Promise<Response>;
    function put<T>(path: string, body?: unknown, options?: BodylessOptions): Promise<T>;
    function put<T>(path: string, body?: unknown, options?: BodylessOptions) {
        return request<T>("PUT", path, { ...options, body } as BodyOptions);
    }

    function patch(
        path: string,
        body?: unknown,
        options?: BodylessOptions & { streaming: true },
    ): Promise<Response>;
    function patch<T>(path: string, body?: unknown, options?: BodylessOptions): Promise<T>;
    function patch<T>(path: string, body?: unknown, options?: BodylessOptions) {
        return request<T>("PATCH", path, { ...options, body } as BodyOptions);
    }

    function remove(path: string, options?: BodyOptions & { streaming: true }): Promise<Response>;
    function remove<T>(path: string, options?: BodyOptions): Promise<T>;
    function remove<T>(path: string, options?: BodyOptions) {
        return request<T>("DELETE", path, options);
    }

    return {
        get,
        post,
        put,
        patch,
        delete: remove,
    };
}
