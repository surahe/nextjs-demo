'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';

// global-error 替换根 layout，因此必须包含 <html> 和 <body>
export default function GlobalError({
    error,
    unstable_retry,
}: {
    error: Error & { digest?: string };
    unstable_retry: () => void;
}) {
    useEffect(() => {
        // 将错误上报到监控服务
        console.error(error);
    }, [error]);

    return (
        <html lang="zh-CN">
            <body className="flex h-screen items-center justify-center bg-zinc-50 font-sans">
                <main className="flex w-fit flex-col items-center justify-between gap-6 bg-white px-16 py-32 sm:items-start">
                    <h1 className="text-6xl font-bold text-red-600">{500}</h1>
                    <div className="space-y-2">
                        <p className="text-xl text-gray-500">应用发生了严重错误</p>
                        {error.digest && (
                            <p className="font-mono text-sm text-gray-400">
                                错误 ID：{error.digest}
                            </p>
                        )}
                        {error.message && (
                            <p className="font-mono text-sm text-gray-400">
                                错误信息：{error.message}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => unstable_retry()}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                        重试
                    </button>
                </main>
            </body>
        </html>
    );
}
