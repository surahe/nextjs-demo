# base-server-fetch

`createBaseServerFetch` 是一个可复用的服务端请求工厂，支持：

- 基础请求方法：`get/post/put/patch/delete`
- URL 拼接与 query 参数合并
- 自动 body 序列化（对象/数组默认 JSON）
- 超时控制（`timeoutMs`）
- HTTP 错误统一抛出 `BaseServerHttpError`
- 业务信封校验（可选）并抛出 `BaseServerApiError`
- 认证头动态注入（可选）
- HTTP 401 与业务 code 未授权回调（可选）

## 导出内容

- `createBaseServerFetch`
- `BaseServerHttpError`
- `BaseServerApiError`
- `BaseServerRequestOptions`
- `CreateBaseServerFetchOptions`

## 快速开始

```ts
import { createBaseServerFetch } from "@/lib/base-server-fetch";

const api = createBaseServerFetch({
    baseURL: "https://example.com/api",
    timeoutMs: 15000,
});

const list = await api.get<{ items: Array<{ id: number }> }>("/users", {
    params: { page: 1, pageSize: 20 },
});
```

## 配置项

`createBaseServerFetch(options)` 顶层配置：

| 配置项               | 类型                                                                                   | 默认值      | 说明                                                   |
| -------------------- | -------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------ |
| `baseURL`            | `string`                                                                               | `""`        | 基础请求地址；`path` 为相对路径时会与其拼接            |
| `headers`            | `HeadersInit`                                                                          | `undefined` | 默认请求头，会与每次请求的 `options.headers` 合并      |
| `timeoutMs`          | `number`                                                                               | `15000`     | 默认超时时间（毫秒）                                   |
| `credentials`        | `RequestCredentials`                                                                   | `undefined` | 透传到 `fetch` 的 `credentials`                        |
| `authHeaders`        | `HeadersInit \| (() => HeadersInit \| Promise<HeadersInit \| undefined> \| undefined)` | `undefined` | 动态认证头，可同步或异步返回（如从 cookie 读取 token） |
| `onHttpUnauthorized` | `(response: Response) => void \| Promise<void>`                                        | `undefined` | HTTP 状态码为 `401` 时回调                             |
| `envelope`           | `EnvelopeOptions`                                                                      | `undefined` | 业务响应信封配置，开启后可按业务 `code` 做统一处理     |

`envelope` 细项：

| 配置项               | 类型                                                        | 默认值      | 说明                                                 |
| -------------------- | ----------------------------------------------------------- | ----------- | ---------------------------------------------------- |
| `enabled`            | `boolean`                                                   | `false`     | 是否启用业务信封处理                                 |
| `codeField`          | `string`                                                    | `"code"`    | 业务码字段名                                         |
| `messageField`       | `string`                                                    | `"msg"`     | 业务错误消息字段名                                   |
| `dataField`          | `string`                                                    | `"data"`    | 业务数据字段名                                       |
| `successCodes`       | `number[]`                                                  | `[0, 200]`  | 业务成功码集合                                       |
| `unauthorizedCodes`  | `number[]`                                                  | `[401]`     | 业务未授权码集合                                     |
| `onUnauthorizedCode` | `(code: number, payload: unknown) => void \| Promise<void>` | `undefined` | 命中 `unauthorizedCodes` 时回调                      |
| `returnDataOnly`     | `boolean`                                                   | `true`      | 成功时是否只返回 `dataField`，`false` 时返回完整信封 |

## 示例

常见能力：token 注入、HTTP 401 处理、业务 code=401 处理、业务码校验。

```ts
import { cookies, headers as getHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { createBaseServerFetch } from "@/lib/base-server-fetch";

function buildSessionExpiredUrl(currentPathname?: string): string {
    const base = "/api/auth/session-expired";
    if (currentPathname && currentPathname !== "/") {
        return `${base}?from=${encodeURIComponent(currentPathname)}`;
    }
    return base;
}

const TOKEN_COOKIE = process.env.NEXT_PUBLIC_TOKEN_COOKIE ?? "pa_token";

export const api = createBaseServerFetch({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
    authHeaders: async () => {
        const cookieStore = await cookies();
        const token = cookieStore.get(TOKEN_COOKIE)?.value;
        return token ? { Authorization: `Bearer ${token}` } : {};
    },
    onHttpUnauthorized: async () => {
        const headerStore = await getHeaders();
        const pathname = headerStore.get("x-next-pathname") ?? "";
        redirect(buildSessionExpiredUrl(pathname));
    },
    envelope: {
        enabled: true,
        codeField: "code",
        messageField: "msg",
        dataField: "data",
        successCodes: [0, 200],
        unauthorizedCodes: [401],
        onUnauthorizedCode: async () => {
            const headerStore = await getHeaders();
            const pathname = headerStore.get("x-next-pathname") ?? "";
            redirect(buildSessionExpiredUrl(pathname));
        },
        returnDataOnly: false,
    },
});
```

## 错误处理

HTTP 错误：

```ts
import { BaseServerHttpError, BaseServerApiError } from "@/lib/base-server-fetch";

try {
    await api.get("/users");
} catch (error) {
    if (error instanceof BaseServerHttpError) {
        console.log(error.status, error.message, error.raw);
    }
    if (error instanceof BaseServerApiError) {
        console.log(error.code, error.message, error.data);
    }
}
```

## 返回值语义

- `envelope.enabled = false`：返回原始响应解析值（JSON 或 text）。
- `envelope.enabled = true` 且识别到业务 `code`：
    - 成功时：
        - `returnDataOnly = true` 返回 `dataField`
        - `returnDataOnly = false` 返回完整业务信封对象
    - 失败时抛 `BaseServerApiError`
