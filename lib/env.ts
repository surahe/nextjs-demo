import { ENV_KEYS, HEADERS } from './constants';

/**
 * 全局环境变量配置中心（可被客户端安全访问的字段）。
 * 客户端可读范围：`NEXT_PUBLIC_*` 与 Next 特殊变量 `NODE_ENV`。
 * 敏感变量（如 JWT_SECRET）请放在 `env.server.ts`。
 */
export const ENV = {
    /**
     * 登录凭证的 Cookie 名称
     */
    TOKEN_COOKIE_NAME: process.env[ENV_KEYS.TOKEN_COOKIE_NAME] ?? HEADERS.TOKEN_COOKIE_NAME,

    /**
     * 当前运行环境
     */
    NODE_ENV: process.env[ENV_KEYS.NODE_ENV] || 'development',

    /**
     * 是否为生产环境
     */
    IS_PRODUCTION: process.env[ENV_KEYS.NODE_ENV] === 'production',
} as const;
