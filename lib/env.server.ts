import 'server-only';
import { ENV_KEYS } from './constants';

/**
 * 仅服务端可用的环境变量配置。
 * 包含密钥等不应进入客户端 bundle 的字段。
 */
export const SERVER_ENV = {
    JWT_SECRET: process.env[ENV_KEYS.JWT_SECRET],
    JWT_EXPIRES_IN: process.env[ENV_KEYS.JWT_EXPIRES_IN] ?? '1d',
} as const;
