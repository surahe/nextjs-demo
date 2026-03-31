import Link from 'next/link';
import ErrorTrigger from './error-trigger';

/**
 * page.tsx — 路由段叶节点
 * 这是用户实际看到的内容，包裹在 layout > template > ErrorBoundary > Suspense 之中。
 *
 * async page：导航到此路由时会显示 loading.tsx（Suspense fallback），
 * 800ms 后 streaming 完成，页面内容替换骨架屏。
 */
async function fetchDemoData() {
    // 模拟数据加载，触发 loading.tsx 的 Suspense fallback
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { loadedAt: new Date().toLocaleTimeString('zh-CN') };
}

const FILES = [
    {
        name: 'layout.tsx',
        color: 'purple',
        badge: 'bg-purple-500',
        border: 'border-purple-300 dark:border-purple-700',
        bg: 'bg-purple-50 dark:bg-purple-950',
        text: 'text-purple-700 dark:text-purple-300',
        desc: '持久化包裹层，跨路由导航不重新挂载，state 保留。',
        when: '始终存在',
    },
    {
        name: 'template.tsx',
        color: 'blue',
        badge: 'bg-blue-500',
        border: 'border-blue-300 dark:border-blue-700',
        bg: 'bg-blue-50 dark:bg-blue-950',
        text: 'text-blue-700 dark:text-blue-300',
        desc: '每次导航重新挂载，state 重置，useEffect 重新执行。',
        when: '始终存在，每次导航后重置',
    },
    {
        name: 'error.tsx',
        color: 'red',
        badge: 'bg-red-500',
        border: 'border-red-300 dark:border-red-700',
        bg: 'bg-red-50 dark:bg-red-950',
        text: 'text-red-700 dark:text-red-300',
        desc: 'ErrorBoundary fallback，必须是 Client Component。捕获子树内所有未处理错误。',
        when: '仅在子树抛出错误时显示',
    },
    {
        name: 'loading.tsx',
        color: 'yellow',
        badge: 'bg-yellow-500',
        border: 'border-yellow-300 dark:border-yellow-700',
        bg: 'bg-yellow-50 dark:bg-yellow-950',
        text: 'text-yellow-700 dark:text-yellow-300',
        desc: 'Suspense fallback，导航到该路由段时 page 完成 streaming 前显示。',
        when: '仅在页面数据加载期间显示',
    },
    {
        name: 'not-found.tsx',
        color: 'orange',
        badge: 'bg-orange-500',
        border: 'border-orange-300 dark:border-orange-700',
        bg: 'bg-orange-50 dark:bg-orange-950',
        text: 'text-orange-700 dark:text-orange-300',
        desc: '调用 notFound() 后的 fallback UI，替换 page 内容渲染。',
        when: '仅在调用 notFound() 后显示',
    },
    {
        name: 'page.tsx',
        color: 'green',
        badge: 'bg-green-500',
        border: 'border-green-300 dark:border-green-700',
        bg: 'bg-green-50 dark:bg-green-950',
        text: 'text-green-700 dark:text-green-300',
        desc: '路由段的叶节点，定义该 URL 对应的实际页面内容。',
        when: '正常情况下显示',
    },
];

export default async function FileStructurePage() {
    const { loadedAt } = await fetchDemoData();

    return (
        <div className="rounded-xl border-2 border-green-400 dark:border-green-600">
            {/* Page 层可见标识 */}
            <div className="flex items-center justify-between rounded-t-[10px] border-b border-green-300 bg-green-50 px-4 py-2 dark:border-green-700 dark:bg-green-950">
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-green-500 px-3 py-0.5 text-xs font-bold text-white">
                        page.tsx
                    </span>
                    <span className="text-xs text-green-700 dark:text-green-300">
                        路由叶节点 — 实际页面内容（加载完成于 {loadedAt}）
                    </span>
                </div>
            </div>

            <div className="space-y-8 p-6">
                {/* 组件层级图 */}
                <section>
                    <h2 className="mb-3 text-lg font-bold text-zinc-800 dark:text-zinc-100">
                        组件层级
                    </h2>
                    <div className="overflow-x-auto rounded-xl border bg-zinc-900 p-4 font-mono text-sm text-zinc-200">
                        <pre>{`<Layout>           ← layout.tsx（紫色）
  <Template>       ← template.tsx（蓝色）
    <ErrorBoundary fallback={<Error />}>    ← error.tsx（红色）
      <Suspense fallback={<Loading />}>     ← loading.tsx（黄色）
        <ErrorBoundary fallback={<NotFound />}>  ← not-found.tsx（橙色）
          <Page />   ← page.tsx（绿色，当前文件）
        </ErrorBoundary>
      </Suspense>
    </ErrorBoundary>
  </Template>
</Layout>`}</pre>
                    </div>
                </section>

                {/* 文件说明卡片 */}
                <section>
                    <h2 className="mb-3 text-lg font-bold text-zinc-800 dark:text-zinc-100">
                        各文件说明
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {FILES.map((f) => (
                            <div
                                key={f.name}
                                className={`rounded-xl border ${f.border} ${f.bg} p-4`}
                            >
                                <div className="mb-1 flex items-center gap-2">
                                    <span
                                        className={`rounded-full ${f.badge} px-2 py-0.5 font-mono text-xs font-bold text-white`}
                                    >
                                        {f.name}
                                    </span>
                                </div>
                                <p className={`text-xs ${f.text} mb-1`}>{f.desc}</p>
                                <p className="text-xs text-zinc-400">显示时机：{f.when}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 交互演示 */}
                <section>
                    <h2 className="mb-3 text-lg font-bold text-zinc-800 dark:text-zinc-100">
                        交互演示
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {/* 触发 loading：重新导航到本页 */}
                        <Link
                            href="/file-structure"
                            className="rounded-xl border-2 border-yellow-300 bg-yellow-50 px-5 py-3 text-sm font-semibold text-yellow-700 transition-colors hover:bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 dark:hover:bg-yellow-900"
                        >
                            ⟳ 重新导航（触发 loading.tsx）
                        </Link>

                        {/* 触发 not-found */}
                        <Link
                            href="/file-structure/trigger-not-found"
                            className="rounded-xl border-2 border-orange-300 bg-orange-50 px-5 py-3 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-700 dark:bg-orange-950 dark:text-orange-300 dark:hover:bg-orange-900"
                        >
                            🔍 触发 not-found.tsx
                        </Link>

                        {/* 触发 error */}
                        <ErrorTrigger />
                    </div>
                    <p className="mt-2 text-xs text-zinc-400">
                        提示：重新导航按钮会先显示 loading.tsx 骨架屏约 800ms， 再渲染此页面内容。
                    </p>
                </section>
            </div>
        </div>
    );
}
