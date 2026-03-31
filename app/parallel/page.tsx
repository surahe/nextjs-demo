const posts = [
    {
        id: 1,
        title: 'Next.js 15 并行路由详解',
        views: 3820,
        date: '2026-03-20',
    },
    {
        id: 2,
        title: 'Tailwind CSS v4 主题系统',
        views: 2140,
        date: '2026-03-18',
    },
    {
        id: 3,
        title: 'React Server Components 最佳实践',
        views: 5670,
        date: '2026-03-15',
    },
    {
        id: 4,
        title: 'Zustand vs Jotai 状态管理对比',
        views: 1890,
        date: '2026-03-12',
    },
];

export default function ParallelPage() {
    return (
        <div>
            {/* 插槽标识 */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                <span className="size-2 rounded-full bg-blue-500" />
                隐式插槽：children（对应 app/parallel/page.tsx）
            </div>

            <h2 className="mb-1 text-2xl font-bold text-zinc-800 dark:text-zinc-100">最新文章</h2>
            <p className="mb-6 text-sm text-zinc-500">主内容区，每篇文章独立渲染</p>

            <div className="space-y-3">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="rounded-xl border bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <h3 className="font-medium text-zinc-800 dark:text-zinc-100">
                                {post.title}
                            </h3>
                            <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
                                {post.views.toLocaleString()} 阅读
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-zinc-400">{post.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
