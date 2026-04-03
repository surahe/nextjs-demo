'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import type { GetInfoData } from '@/types/auth';

/**
 * Server Component 将服务端取到的用户信息传入，
 * 本组件在首次渲染时同步写入 zustand auth store（复用 login），
 * 避免客户端重复请求，也不会造成 hydration 不一致。
 */
export function AuthStoreInitializer({ data }: { data: GetInfoData }) {
    useEffect(() => {
        useAuthStore.getState().login(data.user);
    }, [data.user]);

    return null;
}
