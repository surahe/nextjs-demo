import Link from "next/link";

/**
 * layout.tsx — 持久化层
 * 跨路由导航时不会重新挂载，state 保留。
 * 在组件层级中处于最外层（Template 的父级）。
 */
export default function FileStructureLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen font-sans bg-zinc-50 dark:bg-zinc-950">
            {/* Layout 层可见标识 */}
            <div className="border-b-4 border-purple-500 bg-purple-50 dark:bg-purple-950 px-6 py-3">
                <div className="mx-auto flex max-w-4xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="rounded-full bg-purple-500 px-3 py-0.5 text-xs font-bold text-white">
                            layout.tsx
                        </span>
                        <span className="text-sm text-purple-700 dark:text-purple-300">
                            持久化包裹层 — 导航时不会重新挂载
                        </span>
                    </div>
                    <nav className="flex gap-4 text-sm">
                        <Link
                            href="/"
                            className="text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                        >
                            ← 首页
                        </Link>
                        <Link
                            href="/file-structure"
                            className="font-medium text-purple-700 dark:text-purple-300"
                        >
                            主页面
                        </Link>
                        <Link
                            href="/file-structure/trigger-not-found"
                            className="text-orange-600 transition-colors hover:text-orange-800 dark:text-orange-400"
                        >
                            触发 not-found →
                        </Link>
                    </nav>
                </div>
            </div>

            <div className="mx-auto max-w-4xl p-6">{children}</div>
        </div>
    );
}
