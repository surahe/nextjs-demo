import jwt from 'jsonwebtoken';
import { ENV } from '@/lib/env';
import { buildMockUserInfo } from '@/mocks/auth';
import type { UserInfo } from '@/types/auth';

type AuthPayload = jwt.JwtPayload & {
    userId?: number;
    username?: string;
};

/**
 * 从 JWT 中解析当前用户。返回 null 表示 token 缺失、无效或已过期。
 */
export function getUserFromToken(token: string | undefined): UserInfo | null {
    if (!token || !ENV.JWT_SECRET) return null;

    try {
        // 统一在服务端校验签名与过期时间，避免各处重复写 verify 逻辑。
        const payload = jwt.verify(token, ENV.JWT_SECRET) as AuthPayload;
        const username = payload.username;
        const userId = payload.userId;

        if (!username || !userId) return null;

        const nickname = username === 'admin' ? '管理员' : username;
        return buildMockUserInfo({ id: userId, username, nickname, name: nickname });
    } catch {
        return null;
    }
}
