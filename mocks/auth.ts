import type { UserInfo } from '@/types/auth';

export const MOCK_AUTH_USER = {
    id: 1,
    username: 'admin',
    password: '123456',
    nickname: '管理员',
    phone: '13800000000',
    status: 'Y' as const,
    name: '管理员',
} as const;

export function buildMockUserInfo(overrides: Partial<UserInfo> = {}): UserInfo {
    const nickname = overrides.nickname ?? MOCK_AUTH_USER.nickname;
    return {
        id: overrides.id ?? MOCK_AUTH_USER.id,
        profilePic:
            overrides.profilePic ??
            `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(nickname)}`,
        phone: overrides.phone ?? MOCK_AUTH_USER.phone,
        nickname,
        name: overrides.name ?? nickname,
        username: overrides.username ?? MOCK_AUTH_USER.username,
        status: overrides.status ?? MOCK_AUTH_USER.status,
    };
}
