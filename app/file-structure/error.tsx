"use client";

/**
 * error.tsx — ErrorBoundary fallback（必须是 Client Component）
 * 当该路由段内有未捕获的错误时，Next.js 自动渲染此组件。
 * 层级：Template > ErrorBoundary(error.tsx) > Suspense > Page
 */
export default function FileStructureError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="rounded-xl border-2 border-red-400 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-950">
            <div className="mb-3 inline-block rounded-full bg-red-500 px-3 py-0.5 text-xs font-bold text-white">
                error.tsx
            </div>
            <div className="mb-3 text-5xl">⚠️</div>
            <h2 className="mb-1 text-lg font-semibold text-red-800 dark:text-red-200">
                ErrorBoundary 已捕获错误
            </h2>
            <p className="mb-1 font-mono text-sm text-red-600 dark:text-red-400">
                {error.message}
            </p>
            <p className="mb-5 text-xs text-red-500">
                这就是 error.tsx 生效的场景 — 它是该路由段的错误兜底 UI
            </p>
            <button
                onClick={reset}
                className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
                重置（重新尝试渲染）
            </button>
        </div>
    );
}
