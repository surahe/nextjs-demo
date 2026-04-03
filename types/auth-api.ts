import type { GetInfoData } from '@/types/auth';

export interface LoginResponse {
    code?: number;
    msg?: string;
    data?: {
        userInfo?: {
            id?: number;
            username?: string;
            nickname?: string;
        };
    };
}

export interface GetInfoResponse {
    data?: GetInfoData | null;
}
