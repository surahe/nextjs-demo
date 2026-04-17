import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';

import { ENV } from '@/lib/env';

import type { UserInfo } from '@/types/auth';

interface AuthState {
    user: UserInfo | null;
    login: (userData: UserInfo) => void;
    logout: () => void;
    updateUser: (updates: Partial<UserInfo>) => void;
}

const noopStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
};

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
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
                storage: createJSONStorage(() =>
                    typeof window !== 'undefined' ? localStorage : noopStorage,
                ),
            },
        ),
        {
            name: 'AuthStore',
            enabled: !ENV.IS_PRODUCTION,
        },
    ),
);
