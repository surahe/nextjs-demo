import { createHttpClient } from '@/lib/basic-request';

/**
 * 全局唯一 HTTP 客户端实例。
 * 统一管理 baseURL、credentials 等基础配置。
 */
export const http = createHttpClient({
    baseURL: '/api',
    credentials: 'include',
});
