/**
 * 全局 HTTP Header 常量定义
 * 用于在 Middleware 和 Server Components 之间安全地传递信息，消除魔法字符串。
 */
export const HEADERS = {
    /** 当前请求的路径 (Pathname) */
    CURRENT_PATH: 'x-next-pathname',
    /** 当前请求的完整 URL */
    CURRENT_URL: 'x-next-url',
    /** 用户的真实 IP */
    CLIENT_IP: 'x-real-ip',
    /** 登录凭证 Cookie 名称 */
    TOKEN_COOKIE_NAME: 'session-token',
} as const;
