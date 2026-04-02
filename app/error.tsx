'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';

export default function Error({
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
        <div className="flex h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex w-fit max-w-[60vw] flex-col items-center justify-between gap-6 overflow-hidden bg-white px-16 py-32 sm:items-start dark:bg-black">
                <h1 className="text-destructive text-6xl font-bold">500</h1>
                <div className="space-y-2">
                    <p className="text-muted-foreground text-xl">页面发生了错误</p>
                    {error.digest && (
                        <p className="text-muted-foreground/60 font-mono text-sm">
                            错误 ID：{error.digest}
                        </p>
                    )}
                    <div className="w-[900px] overflow-hidden overflow-x-auto">
                        {error.message && (
                            <div className="text-muted-foreground/60 font-mono text-sm">
                                错误信息：{error.message}
                            </div>
                        )}
                        {error.stack && (
                            <pre className="bg-muted text-muted-foreground max-h-48 rounded p-4 text-xs">
                                {error.stack}
                            </pre>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => unstable_retry()}
                    className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
                >
                    重试
                </button>
            </main>
        </div>
    );
}
