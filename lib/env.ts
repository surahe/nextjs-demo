import { HEADERS } from './constants';

/**
 * 全局环境变量配置中心
 *
 */
export const ENV = {
    /**
     * 登录凭证的 Cookie 名称
     */
    TOKEN_COOKIE_NAME: process.env.NEXT_PUBLIC_TOKEN_COOKIE ?? HEADERS.TOKEN_COOKIE_NAME,
} as const;
