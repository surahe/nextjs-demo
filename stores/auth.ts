import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { ENV } from '@/lib/env';

import type { UserInfo } from '@/types/auth';

interface AuthState {
    user: UserInfo | null;
    login: (userData: UserInfo) => void;
    logout: () => void;
    updateUser: (updates: Partial<UserInfo>) => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        (set) => ({
            user: null,
            login: (userData: UserInfo) =>
                set(
                    () => ({
                        user: userData,
                    }),
                    false,
                    'auth/login',
                ),

            logout: () =>
                set(
                    () => ({
                        user: null,
                    }),
                    false,
                    'auth/logout',
                ),

            updateUser: (updates: Partial<UserInfo>) =>
                set(
                    (state) => ({
                        user: state.user ? { ...state.user, ...updates } : null,
                    }),
                    false,
                    'auth/updateUser',
                ),
        }),
        {
            name: 'AuthStore',
            enabled: !ENV.IS_PRODUCTION,
        },
    ),
);
