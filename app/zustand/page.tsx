'use client';

import { useDemoStore } from '@/stores/demo';
import { useAuthStore } from '@/stores/auth';
import { buildMockUserInfo } from '@/mocks/auth';
import { useShallow } from 'zustand/react/shallow';
import Link from 'next/link';

export default function ZustandDemoPage() {
    // Demo Store
    const { count, profile } = useDemoStore(
        useShallow((state) => ({
            count: state.count,
            profile: state.profile,
        })),
    );
    const increment = useDemoStore((state) => state.increment);
    const updateTheme = useDemoStore((state) => state.updateTheme);
    const reset = useDemoStore((state) => state.reset);

    // Auth Store
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = Boolean(user);
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);
    const updateUser = useAuthStore((state) => state.updateUser);

    return (
        <div className="min-h-screen bg-zinc-50 p-8 font-sans dark:bg-zinc-950">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Zustand 状态管理演示
                        </h1>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            结合 immer, persist, devtools 和 useShallow
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                        返回首页
                    </Link>
                </div>

                <div className="space-y-6">
                    {/* Auth Store 演示 */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                                全局认证状态 (Auth Store)
                            </h2>
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    isAuthenticated
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                }`}
                            >
                                {isAuthenticated ? '已登录' : '未登录'}
                            </span>
                        </div>

                        {isAuthenticated && user ? (
                            <div className="mb-6 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800/50">
                                <h3 className="mb-2 font-medium text-zinc-700 dark:text-zinc-300">
                                    当前用户信息:
                                </h3>
                                <pre className="overflow-auto rounded-md bg-zinc-900 p-3 text-sm text-zinc-300">
                                    {JSON.stringify(user, null, 2)}
                                </pre>
                            </div>
                        ) : (
                            <div className="mb-6 rounded-lg border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    请点击下方按钮模拟登录
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {!isAuthenticated ? (
                                <button
                                    onClick={() => login(buildMockUserInfo())}
                                    className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800"
                                >
                                    模拟登录 (Login)
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={logout}
                                        className="flex items-center justify-center rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-colors hover:bg-red-700 active:bg-red-800"
                                    >
                                        退出登录 (Logout)
                                    </button>

                                    <button
                                        onClick={() => updateUser({ nickname: 'Sura (已更新)' })}
                                        className="flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                    >
                                        更新昵称 (Update Nickname)
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Demo Store 状态可视化区 */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                            当前状态 (State)
                        </h2>

                        <div className="mb-4 flex items-center justify-between rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800/50">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                Count 计数器:
                            </span>
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {count}
                            </span>
                        </div>

                        <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800/50">
                            <span className="mb-2 block font-medium text-zinc-700 dark:text-zinc-300">
                                Profile 配置:
                            </span>
                            <pre className="overflow-auto rounded-md bg-zinc-900 p-3 text-sm text-zinc-300">
                                {JSON.stringify(profile, null, 2)}
                            </pre>
                        </div>
                    </div>

                    {/* 操作控制区 */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                            操作面板 (Actions)
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <button
                                onClick={increment}
                                className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
                            >
                                增加 Count (+1)
                            </button>

                            <button
                                onClick={reset}
                                className="flex items-center justify-center rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-colors hover:bg-red-700 active:bg-red-800"
                            >
                                重置状态 (Reset)
                            </button>

                            <button
                                onClick={() => updateTheme('light')}
                                disabled={profile?.preferences?.theme === 'light'}
                                className="flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                切换 Light 主题
                            </button>

                            <button
                                onClick={() => updateTheme('dark')}
                                disabled={profile?.preferences?.theme === 'dark'}
                                className="flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                            >
                                切换 Dark 主题
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
