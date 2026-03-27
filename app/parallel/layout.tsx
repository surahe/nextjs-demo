import Link from 'next/link';

export default function ParallelLayout({
    children,
    sidebar,
    stats,
}: {
    children: React.ReactNode;
    sidebar: React.ReactNode;
    stats: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 font-sans">
            {/* 顶部说明栏 */}
            <header className="border-b bg-white dark:bg-zinc-900 px-6 py-3 flex items-center gap-4">
                <Link
                    href="/"
                    className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                    ← 返回
                </Link>
                <div>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                        并行路由 Demo
                    </span>
                    <span className="ml-3 text-xs text-zinc-500">
                        同一布局同时渲染 3 个独立插槽：
                        <code className="mx-1 px-1 bg-zinc-100 dark:bg-zinc-800 rounded text-purple-600 dark:text-purple-400">
                            @sidebar
                        </code>
                        <code className="mx-1 px-1 bg-zinc-100 dark:bg-zinc-800 rounded text-blue-600 dark:text-blue-400">
                            children
                        </code>
                        <code className="mx-1 px-1 bg-zinc-100 dark:bg-zinc-800 rounded text-green-600 dark:text-green-400">
                            @stats
                        </code>
                    </span>
                </div>
            </header>

            {/* 三栏布局，每栏对应一个 slot */}
            <div className="flex h-[calc(100vh-49px)]">
                {/* @sidebar slot */}
                <aside className="w-56 shrink-0 border-r bg-white dark:bg-zinc-900 overflow-auto">
                    {sidebar}
                </aside>

                {/* children slot（隐式 @children） */}
                <main className="flex-1 overflow-auto p-6">{children}</main>

                {/* @stats slot */}
                <aside className="w-72 shrink-0 border-l bg-white dark:bg-zinc-900 overflow-auto p-4">
                    {stats}
                </aside>
            </div>
        </div>
    );
}
