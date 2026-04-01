# basic-request

一个面向业务项目的通用 HTTP 请求库，基于 `fetch`，支持重试、超时、降级切换、去重、GET 缓存、并发控制、中间件、轮询与分页聚合。

## 特性

- TypeScript 友好：完整类型定义与泛型返回值
- 实例级与请求级配置合并：默认配置 + 单次覆盖
- 服务前缀路由：同主域下多后端前缀切换
- 重试与退避：支持自定义幂等判断与重试策略
- 故障切换：支持 fallback baseURL 与可配置切换条件
- 超时控制：请求超时与 polling 总超时
- 请求去重：同 key 并发请求复用同一个 Promise
- GET 缓存：TTL + 最大容量控制
- 并发控制：限制最大并发请求数
- 中间件系统：onRequest / onResponse / onError
- 敏感字段脱敏：日志与埋点场景可安全输出
- 工具方法：`loopRequest`、`askUntil`、`adaptLegacyRequest`

## 快速开始

```ts
import { createHttpClient } from "@/lib/basic-request";

type User = {
    id: string;
    name: string;
};

const http = createHttpClient({
    baseURL: "/api",
    timeoutMs: 10000,
    headers: {
        "x-client": "admin-front",
    },
});

const user = await http.get<User>("/users/detail", {
    params: { id: "u_001" },
});
```

## 核心 API

### createHttpClient

```ts
import { createHttpClient } from "@/lib/basic-request";

const http = createHttpClient(options);
```

客户端实例方法：

- `get<T>(path, options?)`
- `post<T>(path, body?, options?)`
- `put<T>(path, body?, options?)`
- `patch<T>(path, body?, options?)`
- `delete<T>(path, options?)`

当 `options.streaming = true` 时，上述方法返回 `Promise<Response>`：

```ts
const response = await http.post("/ai/chat", { prompt: "hello" }, { streaming: true });
const reader = response.body?.getReader();
while (true) {
    const { done, value } = await reader!.read();
    if (done) break;
    console.log(new TextDecoder().decode(value));
}
```

`delete` 方法支持传 body（批量删除等场景）：

````ts
await http.delete<void>("/orders", { body: { ids: ["a", "b"] } });

## 响应模式

默认不要求后端响应是 `{ code, data, msg }` 信封结构，会直接返回解析后的响应体。

如需启用信封模式：

```ts
const http = createHttpClient({
  envelope: {
    enabled: true,
    successCodes: [0, 200],
  },
});
````

启用后：

- 命中 `successCodes`：返回 `payload.data`
- 未命中：抛出 `ApiError`

## 配置项

### 实例级配置（HttpClientOptions）

| 字段                   | 说明                                            |
| ---------------------- | ----------------------------------------------- |
| `baseURL`              | 主请求域名或前缀                                |
| `fallbackBaseURLs`     | 失败时可切换的备用 baseURL 列表                 |
| `servicePrefixes`      | 服务名前缀映射，如 `{ order: "/order-api" }`    |
| `defaultServicePrefix` | 默认服务前缀                                    |
| `credentials`          | fetch credentials                               |
| `headers`              | 默认请求头                                      |
| `onUnauthorized`       | 收到 401 时的回调（执行后仍会抛出 `HttpError`） |
| `timeoutMs`            | 默认超时毫秒                                    |
| `retry`                | 默认重试配置                                    |
| `failover`             | 默认故障切换配置                                |
| `sensitiveFields`      | 默认脱敏字段配置                                |
| `dedupe`               | 默认去重配置                                    |
| `getCache`             | 默认 GET 缓存配置                               |
| `concurrency`          | 默认并发控制配置                                |
| `middlewares`          | 中间件数组                                      |
| `envelope`             | 是否启用信封模式                                |

### 请求级配置（RequestOptions）

| 字段                   | 说明                                                           |
| ---------------------- | -------------------------------------------------------------- |
| `params`               | query 参数对象                                                 |
| `body`                 | 请求体（对象 / FormData / URLSearchParams / 原生 BodyInit）    |
| `headers`              | 覆盖或补充请求头                                               |
| `signal`               | AbortSignal                                                    |
| `servicePrefix`        | 指定服务前缀 key 或直接传前缀字符串                            |
| `disableServicePrefix` | 禁用服务前缀拼接                                               |
| `timeoutMs`            | 覆盖默认超时（与 `signal` 同时传入时两者合并，任一触发即取消） |
| `retry`                | 覆盖默认重试配置，传 `false` 可关闭                            |
| `fallbackBaseURLs`     | 单次请求追加备用 baseURL                                       |
| `failover`             | 覆盖默认故障切换，传 `false` 可关闭                            |
| `streaming`            | 返回原生 `Response`                                            |
| `sensitiveFields`      | 覆盖默认脱敏字段                                               |
| `dedupe`               | 覆盖默认去重，传 `false` 可关闭                                |
| `getCache`             | 覆盖默认缓存，传 `false` 可关闭                                |
| `concurrency`          | 覆盖默认并发控制，传 `false` 可关闭                            |

## 路由前缀

```ts
const http = createHttpClient({
    baseURL: "/api",
    servicePrefixes: {
        order: "/order-api",
        payment: "/payment-api",
    },
    defaultServicePrefix: "/gateway",
});

await http.get("/list");
await http.get("/orders", { servicePrefix: "order" });
await http.get("/pay", { servicePrefix: "payment" });
await http.get("/raw", { disableServicePrefix: true });
```

## 中间件

中间件支持三类钩子：

- `onRequest(context)`：可返回 `RequestMutation`，动态修改 method/path/url/headers/body/credentials。**注意：`headers` 是整体替换不是合并**，需要保留原有 headers 时应展开原值
- `onResponse(context)`：响应成功后执行
- `onError(context)`：请求异常时执行

```ts
import { createHttpClient } from "@/lib/basic-request";

const http = createHttpClient({
    middlewares: [
        {
            onRequest(ctx) {
                return {
                    headers: {
                        ...ctx.request.headers,
                        "x-trace-id": crypto.randomUUID(),
                    },
                };
            },
        },
    ],
});
```

## 内置中间件工厂

### createQueryParamInjectionMiddleware

把浏览器 URL query 参数注入到请求中。

```ts
import { createHttpClient, createQueryParamInjectionMiddleware } from "@/lib/basic-request";

const queryInjection = createQueryParamInjectionMiddleware({
    fields: [
        { sourceKeys: ["sid"], targetKey: "sid" },
        { sourceKeys: ["userId", "userid"], targetKey: "userId" },
    ],
    // enabled: true,       // 静态开关，默认 true
    // isEnabled: () => bool // 动态开关，每次请求时求值
});

const http = createHttpClient({
    middlewares: [queryInjection],
});
```

行为：

- `GET/HEAD/OPTIONS`：写入 URL query
- 其他方法：
    - body 为空：创建对象 body
    - body 为 plain object：合并注入
    - body 为 `FormData`：克隆后 append，避免污染调用方引用

### createSidUserIdMiddleware

`createQueryParamInjectionMiddleware` 的快捷封装，用于常见 sid/userId 注入场景。

```ts
import { createSidUserIdMiddleware } from "@/lib/basic-request";

const sidMiddleware = createSidUserIdMiddleware({
    sidParamKeys: ["sid"],
    userIdParamKeys: ["userId", "userid"],
});
```

### createMockRequestMiddleware

将请求重定向到 mock 服务器。

```ts
import { createHttpClient, createMockRequestMiddleware } from "@/lib/basic-request";

const mockMiddleware = createMockRequestMiddleware({
    mockBaseURL: "http://localhost:3001",
    shouldMock: (ctx) => ctx.path.startsWith("/orders"),
});

const http = createHttpClient({
    middlewares: [mockMiddleware],
});
```

## 重试与故障切换

### retry

```ts
const http = createHttpClient({
    retry: {
        retries: 2,
        retryDelayMs: 300,
        maxRetryDelayMs: 2000,
        backoffFactor: 2,
        jitter: true,
        retryableMethods: ["GET", "PUT", "DELETE"],
        retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    },
});
```

### failover

```ts
const http = createHttpClient({
    baseURL: "https://api-a.example.com",
    fallbackBaseURLs: ["https://api-b.example.com"],
    failover: {
        switchOnStatusCodes: [502, 503, 504],
        switchOnNetworkError: true,
        switchOnTimeout: true,
    },
});
```

## 去重、缓存、并发控制

```ts
const http = createHttpClient({
    dedupe: {
        enabled: true,
        methods: ["GET"],
    },
    getCache: {
        enabled: true,
        ttlMs: 5000,
        maxSize: 1000,
        methods: ["GET"],
    },
    concurrency: {
        enabled: true,
        maxConcurrent: 6,
    },
});
```

> **去重行为说明**：同 key 并发请求共享同一个 Promise。如果首个请求失败，所有等待方都会收到同一个 rejection。

## 错误类型

- `HttpError`：HTTP 非 2xx（包含 `status`、`raw`）
- `ApiError`：启用 envelope 且业务 code 非成功码
- `TimeoutError`：超时导致 abort

```ts
import { ApiError, HttpError, TimeoutError } from "@/lib/basic-request";

try {
    await http.get("/users");
} catch (e) {
    if (e instanceof TimeoutError) {
    }
    if (e instanceof HttpError) {
    }
    if (e instanceof ApiError) {
    }
}
```

## 工具函数

### loopRequest

用于分页拉取并聚合列表。支持 `signal` 取消、`advance` 翻页回调、`onError` 错误处理。

```ts
import { loopRequest } from "@/lib/basic-request";

const controller = new AbortController();

const items = await loopRequest({
    signal: controller.signal,
    request: ({ pageIndex, signal }) =>
        http.get<{ list: { id: string }[]; hasMore: boolean }>("/orders", {
            params: { page: pageIndex, pageSize: 20 },
            signal,
        }),
    extractItems: (page) => page.list,
    hasMore: (page) => page.hasMore,
    advance: async (page, items, pageIndex) => {
        // 可选：翻页前的准备工作，如更新游标
    },
    maxPages: 50,
    stopOnError: true, // 默认 true，出错即停止
    onError: async (err, pageIndex) => {
        console.warn(`Page ${pageIndex} failed:`, err);
    },
});
```

### askUntil

用于轮询直到条件满足，支持总超时与取消。轮询间隔等待阶段也支持即时取消（通过 `signal`），不会傻等下一个 interval。

```ts
import { askUntil } from "@/lib/basic-request";

const controller = new AbortController();

const result = await askUntil({
    signal: controller.signal,
    timeoutMs: 30000,
    intervalMs: 2000,
    request: ({ signal }) =>
        http.get<{ done: boolean; result?: string }>("/task/status", { signal }),
    until: (res) => (res.done ? (res.result ?? "") : false),
});
```

## 兼容旧项目行为

### adaptLegacyRequest

用于将 Promise 请求适配为历史项目的错误返回结构。

```ts
import { adaptLegacyRequest } from "@/lib/basic-request";

const data = await adaptLegacyRequest(http.get("/users"), {
    useReject: false,
    fixFetchError: true,
    fallbackCode: 444444,
    fallbackMsg: "请求接口失败",
});
```

返回形态：

- `useReject = true`：保持抛错语义
- `useReject = false && fixFetchError = true`：返回 `{ state: { code, msg }, data }`

## 最佳实践

- 对非幂等请求谨慎开启自动重试
- `dedupe` 与 `getCache` 建议优先用于 GET
- 中间件中优先返回 mutation，避免直接改共享对象
- 中间件返回 `headers` 时记得展开原 headers：`{ ...ctx.request.headers, "x-new": "val" }`
- 轮询与长分页场景统一透传 `signal`
- 对外部日志系统只输出 `safeHeaders/safeBody`

## 401 处理行为

`onUnauthorized` 在收到 HTTP 401 后同步回调，回调完成后仍然会抛出 `HttpError(401)`。如果在回调中使用 `window.location.replace()` 跳转登录页，后续的 `throw` 不影响跳转。

```ts
const http = createHttpClient({
    onUnauthorized: async () => {
        await fetch("/auth/logout", { method: "POST" });
        window.location.replace("/login");
    },
});
```

## 工具导出

| 导出                                      | 用途                           |
| ----------------------------------------- | ------------------------------ |
| `createHttpClient`                        | 创建 HTTP 客户端实例           |
| `createQueryParamInjectionMiddleware`     | URL 参数注入中间件             |
| `createSidUserIdMiddleware`               | sid/userId 注入快捷中间件      |
| `createMockRequestMiddleware`             | Mock 请求重定向中间件          |
| `loopRequest`                             | 分页聚合工具                   |
| `askUntil`                                | 轮询工具                       |
| `adaptLegacyRequest`                      | 旧项目错误适配                 |
| `redactSensitiveData`                     | 手动脱敏工具（日志中间件可用） |
| `HttpError` / `ApiError` / `TimeoutError` | 错误类型                       |
