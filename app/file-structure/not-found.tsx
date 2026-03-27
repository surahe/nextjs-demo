import Link from "next/link";

/**
 * not-found.tsx — notFound() 调用后的 fallback UI
 * 当该路由段内调用 notFound() 时，Next.js 渲染此组件。
 */
export default function FileStructureNotFound() {
    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <div className="max-w-sm rounded-xl border-2 border-orange-400 bg-orange-50 p-10 text-center dark:border-orange-700 dark:bg-orange-950">
                <div className="mb-3 inline-block rounded-full bg-orange-500 px-3 py-0.5 text-xs font-bold text-white">
                    not-found.tsx
                </div>
                <div className="mb-4 text-6xl">🔍</div>
                <h2 className="mb-2 text-2xl font-bold text-orange-800 dark:text-orange-200">
                    页面不存在
                </h2>
                <p className="mb-1 text-sm text-orange-600 dark:text-orange-400">
                    路由段内调用了{" "}
                    <code className="rounded bg-orange-100 px-1 dark:bg-orange-900">
                        notFound()
                    </code>
                </p>
                <p className="mb-6 text-xs text-orange-500">
                    Next.js 自动渲染了最近的 not-found.tsx
                </p>
                <Link
                    href="/file-structure"
                    className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
                >
                    返回演示页
                </Link>
            </div>
        </div>
    );
}
