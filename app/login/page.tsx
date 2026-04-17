'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { HttpError } from '@/lib/basic-request';
import { http } from '@/lib/http';
import { useAuthStore } from '@/stores/auth';
import type { GetInfoResponse, LoginResponse } from '@/types/auth-api';

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const login = useAuthStore((state) => state.login);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const callbackUrl = useMemo(() => {
        // 仅允许站内相对路径，避免 open redirect。
        const raw = searchParams.get('callback_url') ?? '/dashboard';
        return raw.startsWith('/') ? raw : '/dashboard';
    }, [searchParams]);

    const onSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();

        if (!username.trim() || !password.trim()) {
            setErrorMessage('请输入用户名和密码');
            return;
        }

        setSubmitting(true);
        setErrorMessage('');
        try {
            // 第一步：提交账号密码，服务端签发并写入 httpOnly cookie。
            const loginJson = await http.post<LoginResponse>('/user/login', {
                username: username.trim(),
                password,
            });

            if (loginJson.code !== 200) {
                setErrorMessage(loginJson.msg ?? '登录失败');
                return;
            }

            // 第二步：通过 getInfo 拉取标准化用户结构，写入前端 store。
            const getInfoJson = await http.get<GetInfoResponse>('/user/getInfo');

            const user = getInfoJson.data?.user;
            if (user) {
                login(user);
            } else {
                const fallbackName = loginJson.data?.userInfo?.nickname ?? username.trim();
                login({
                    id: loginJson.data?.userInfo?.id ?? 1,
                    profilePic: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(fallbackName)}`,
                    phone: '',
                    nickname: fallbackName,
                    name: fallbackName,
                    username: loginJson.data?.userInfo?.username ?? username.trim(),
                    status: 'Y',
                });
            }

            router.replace(callbackUrl);
            router.refresh();
        } catch (error) {
            if (error instanceof HttpError) {
                const message =
                    typeof error.raw === 'object' &&
                    error.raw &&
                    'msg' in error.raw &&
                    typeof error.raw.msg === 'string'
                        ? error.raw.msg
                        : error.message;
                setErrorMessage(message || '登录失败');
            } else {
                setErrorMessage('服务器繁忙，请稍后重试');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
            <main className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-6 space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                        登录
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        请输入账号密码登录（示例：admin / 123456）。
                    </p>
                </div>

                <form className="space-y-4" onSubmit={onSubmit}>
                    <label className="block space-y-1">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                            用户名
                        </span>
                        <input
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="admin"
                            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm transition-colors outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
                        />
                    </label>

                    <label className="block space-y-1">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                            密码
                        </span>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="123456"
                            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm transition-colors outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
                        />
                    </label>

                    {errorMessage ? (
                        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        {submitting ? '登录中...' : '登录'}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                        返回首页
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950" />}>
            <LoginPageContent />
        </Suspense>
    );
}
