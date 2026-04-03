'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

export function useLogout() {
    const router = useRouter();
    const logout = useAuthStore((s) => s.logout);

    return async function handleLogout() {
        try {
            await fetch('/api/user/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } finally {
            logout();
            router.replace('/login');
            router.refresh();
        }
    };
}
