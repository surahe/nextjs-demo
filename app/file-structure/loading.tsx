/**
 * loading.tsx — Suspense fallback
 * Next.js 自动将此文件包裹在路由段的 Suspense 边界中。
 * 当导航到该路由时，在 page.tsx 完成 streaming 前显示此 UI。
 */
export default function FileStructureLoading() {
    return (
        <div className="rounded-xl border-2 border-yellow-400 bg-yellow-50 p-8 dark:border-yellow-600 dark:bg-yellow-950">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-yellow-500 px-3 py-0.5 text-xs font-bold text-white">
                        loading.tsx
                    </span>
                    <span className="text-xs text-yellow-700 dark:text-yellow-300">
                        Suspense fallback — page.tsx 完成前显示
                    </span>
                </div>
                <span className="animate-spin text-xl text-yellow-500">⟳</span>
            </div>

            {/* 骨架屏 */}
            <div className="animate-pulse space-y-3">
                <div className="h-6 w-1/3 rounded-lg bg-yellow-200 dark:bg-yellow-800" />
                <div className="h-4 w-3/4 rounded bg-yellow-200 dark:bg-yellow-800" />
                <div className="h-4 w-1/2 rounded bg-yellow-200 dark:bg-yellow-800" />
                <div className="mt-4 grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 rounded-xl bg-yellow-200 dark:bg-yellow-800" />
                    ))}
                </div>
            </div>
        </div>
    );
}
