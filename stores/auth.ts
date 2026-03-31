import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ENV } from '@/lib/env';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'user';
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;

    // Actions
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                isAuthenticated: false,

                login: (userData: User) =>
                    set(
                        () => ({
                            user: userData,
                            isAuthenticated: true,
                        }),
                        false,
                        'auth/login',
                    ),

                logout: () =>
                    set(
                        () => ({
                            user: null,
                            isAuthenticated: false,
                        }),
                        false,
                        'auth/logout',
                    ),

                updateUser: (updates: Partial<User>) =>
                    set(
                        (state) => ({
                            user: state.user ? { ...state.user, ...updates } : null,
                        }),
                        false,
                        'auth/updateUser',
                    ),
            }),
            {
                name: 'auth-storage',
            },
        ),
        {
            name: 'AuthStore',
            enabled: !ENV.IS_PRODUCTION,
        },
    ),
);
