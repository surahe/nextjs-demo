import { ENV_KEYS, HEADERS } from './constants';

/**
 * 全局环境变量配置中心
 *
 */
export const ENV = {
    /**
     * 登录凭证的 Cookie 名称
     */
    TOKEN_COOKIE_NAME: process.env[ENV_KEYS.TOKEN_COOKIE_NAME] ?? HEADERS.TOKEN_COOKIE_NAME,

    /**
     * JWT 签名密钥（服务端）
     */
    JWT_SECRET: process.env[ENV_KEYS.JWT_SECRET],

    /**
     * JWT 过期时间（服务端），默认 1 天
     */
    JWT_EXPIRES_IN: process.env[ENV_KEYS.JWT_EXPIRES_IN] ?? '1d',

    /**
     * 当前运行环境
     */
    NODE_ENV: process.env[ENV_KEYS.NODE_ENV] || 'development',

    /**
     * 是否为生产环境
     */
    IS_PRODUCTION: process.env[ENV_KEYS.NODE_ENV] === 'production',
} as const;
