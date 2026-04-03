import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ENV } from '@/lib/env';

interface UserProfile {
    name: string;
    preferences: {
        theme: 'light' | 'dark';
        notifications: boolean;
    };
}

interface DemoState {
    count: number;
    profile: UserProfile | null;
    increment: () => void;
    updateTheme: (theme: 'light' | 'dark') => void;
    reset: () => void;
}

export const useDemoStore = create<DemoState>()(
    devtools(
        immer((set) => ({
            count: 0,
            profile: {
                name: 'Guest',
                preferences: { theme: 'light', notifications: true },
            },
            increment: () =>
                set(
                    (state) => {
                        state.count += 1;
                    },
                    false,
                    'demo/increment',
                ),
            updateTheme: (newTheme: 'light' | 'dark') =>
                set(
                    (state) => {
                        if (state.profile) {
                            state.profile.preferences.theme = newTheme;
                        }
                    },
                    false,
                    'demo/updateTheme',
                ),
            reset: () =>
                set(
                    (state) => {
                        state.count = 0;
                        state.profile = null;
                    },
                    false,
                    'demo/reset',
                ),
        })),
        {
            name: 'DemoStore',
            enabled: !ENV.IS_PRODUCTION,
        },
    ),
);
