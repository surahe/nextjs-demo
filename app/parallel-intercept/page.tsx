import Link from 'next/link';
import { photos } from './data';

const patterns = [
  {
    syntax: '@folder',
    meaning: '命名插槽',
    use: '侧边栏 + 主内容',
    color: 'bg-blue-500',
    desc: '父布局通过 props 接收由 @folder 定义的具名插槽，可在同一 URL 下并行渲染多个独立视图。',
  },
  {
    syntax: '(.)folder',
    meaning: '拦截同级路由',
    use: '在模态框中预览同级路由',
    color: 'bg-emerald-500',
    desc: '在当前段层级拦截同级路由。从列表点击详情时显示模态框，直接访问 URL 则展示完整页面。',
  },
  {
    syntax: '(..)folder',
    meaning: '拦截父级路由',
    use: '将父级的子级作为覆盖层打开',
    color: 'bg-amber-500',
    desc: '跨越一个路由段层级进行拦截，在子路由中覆盖显示父级的某个路由内容。',
  },
  {
    syntax: '(..)(..)folder',
    meaning: '拦截两级路由',
    use: '深度嵌套的覆盖层',
    color: 'bg-orange-500',
    desc: '跨越两个路由段层级进行拦截，适合深度嵌套时在顶层弹出覆盖层的场景。',
  },
  {
    syntax: '(...)folder',
    meaning: '从根拦截',
    use: '在当前视图中显示任意路由',
    color: 'bg-purple-500',
    desc: '从应用根目录开始匹配，可以在任意嵌套层级拦截根级路由，实现跨层级的覆盖层效果。',
  },
];

export default function ParallelInterceptPage() {
  return (
    <div className="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">

        {/* 页头 */}
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-8 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500 text-white shadow-sm">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">并行路由 & 拦截路由</h1>
              <span className="text-sm font-medium text-violet-600 dark:text-violet-400">Parallel Routes & Intercepting Routes</span>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            这两个特性适用于特定的 UI 模式：并行路由（<code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-slate-800 dark:bg-slate-700 dark:text-slate-200">@slot</code>）允许在同一布局中同时渲染多个页面；拦截路由允许在不改变 URL 的情况下，在当前视图内覆盖另一个路由——最典型的用例就是从列表点击后弹出模态框，而直接访问 URL 时展示完整页面。
          </p>
        </header>

        {/* 模式速查表 */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">路由模式速查</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                  <th className="px-5 py-3 text-left font-semibold text-slate-500 dark:text-slate-400">模式（文档）</th>
                  <th className="px-5 py-3 text-left font-semibold text-slate-500 dark:text-slate-400">含义</th>
                  <th className="hidden px-5 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 sm:table-cell">典型用例</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {patterns.map((p) => (
                  <tr key={p.syntax} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-xs font-bold text-white ${p.color}`}>
                        {p.syntax}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-700 dark:text-slate-300">{p.meaning}</td>
                    <td className="hidden px-5 py-3 text-slate-500 dark:text-slate-400 sm:table-cell">{p.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 模式详解卡片 */}
        <section className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold">核心原理详解</h2>

          {/* 并行路由 */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">1</span>
              <div className="flex flex-col gap-1">
                <h3 className="font-mono text-base font-bold text-blue-600 dark:text-blue-400">@folder — 命名插槽（并行路由）</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  在 <code className="rounded bg-slate-100 px-1 font-mono text-xs dark:bg-slate-800">app/</code> 目录下，以 <code className="rounded bg-slate-100 px-1 font-mono text-xs dark:bg-slate-800">@</code> 开头的文件夹是命名插槽。父 <code className="rounded bg-slate-100 px-1 font-mono text-xs dark:bg-slate-800">layout.tsx</code> 会自动接收与插槽同名的 prop，从而可以在同一页面中并行渲染多个独立的路由段，各自拥有独立的加载状态与错误边界。
                </p>
              </div>
            </div>
            <div className="ml-10 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-2">
                <div className="size-2.5 rounded-full bg-red-500/40" />
                <div className="size-2.5 rounded-full bg-yellow-500/40" />
                <div className="size-2.5 rounded-full bg-green-500/40" />
                <span className="ml-2 font-mono text-[10px] text-slate-500">layout.tsx</span>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-loose text-slate-300"><code>{`// app/dashboard/layout.tsx
export default function Layout({
  children,   // app/dashboard/page.tsx
  sidebar,    // app/dashboard/@sidebar/page.tsx
  analytics,  // app/dashboard/@analytics/page.tsx
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  analytics: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[240px_1fr]">
      <aside>{sidebar}</aside>
      <main>
        {children}
        {analytics}
      </main>
    </div>
  );
}`}</code></pre>
            </div>
          </div>

          {/* 拦截路由 */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">2</span>
              <div className="flex flex-col gap-1">
                <h3 className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">(.)folder — 拦截路由</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  拦截路由使用 <code className="rounded bg-slate-100 px-1 font-mono text-xs dark:bg-slate-800">(.)</code>、<code className="rounded bg-slate-100 px-1 font-mono text-xs dark:bg-slate-800">(..)</code>、<code className="rounded bg-slate-100 px-1 font-mono text-xs dark:bg-slate-800">(...)</code> 前缀来拦截对应段层级的路由。当用户通过<strong>客户端导航</strong>（点击 Link）到达时，渲染拦截版本（如模态框）；当用户直接输入 URL 或刷新页面时，渲染原始的完整页面。两个功能的组合是实现模态路由的标准方案。
                </p>
              </div>
            </div>
            <div className="ml-10 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-2">
                <div className="size-2.5 rounded-full bg-red-500/40" />
                <div className="size-2.5 rounded-full bg-yellow-500/40" />
                <div className="size-2.5 rounded-full bg-green-500/40" />
                <span className="ml-2 font-mono text-[10px] text-slate-500">文件结构</span>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-loose text-slate-300"><code>{`app/
  parallel-intercept/
    layout.tsx            ← 渲染 children + @modal
    page.tsx              ← 照片列表（children 插槽）
    @modal/
      default.tsx         ← 默认返回 null（无模态）
      (.)photo/
        [id]/
          page.tsx        ← 模态框内容（拦截版本）
    photo/
      [id]/
        page.tsx          ← 完整照片页（直接访问 URL）`}</code></pre>
            </div>
          </div>
        </section>

        {/* 实时演示 */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">实时演示 — 照片库</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              点击照片触发模态框
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            点击下方任意照片卡片，Next.js 会通过客户端导航拦截路由，在当前页面弹出模态框，同时 URL 仍然更新为 <code className="font-mono">/parallel-intercept/photo/[id]</code>。刷新页面后，将直接展示该照片的完整详情页。
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {photos.map((photo) => (
              <Link
                key={photo.id}
                href={`/parallel-intercept/photo/${photo.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${photo.color}`}>
                  <span className="text-5xl">{photo.emoji}</span>
                </div>
                <div className="flex flex-col gap-0.5 p-3">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{photo.title}</span>
                  <span className="text-xs text-slate-400">{photo.subtitle}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 工作原理示意 */}
        <section className="flex flex-col gap-4 rounded-2xl bg-slate-900 p-8 text-white shadow-xl dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <h2 className="text-xl font-bold">工作原理</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-800 p-5">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400" />
                <h3 className="font-semibold text-emerald-400">客户端导航（点击 Link）</h3>
              </div>
              <ol className="flex flex-col gap-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-slate-400">1</span>
                  用户在画廊页面点击照片链接
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-slate-400">2</span>
                  Next.js 检测到 <code className="rounded bg-slate-700 px-1 font-mono text-xs">(.)photo/[id]</code> 拦截规则
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-slate-400">3</span>
                  <code className="rounded bg-slate-700 px-1 font-mono text-xs">@modal</code> 插槽渲染模态框，<code className="rounded bg-slate-700 px-1 font-mono text-xs">children</code> 保持画廊页
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-slate-400">4</span>
                  URL 更新，但用户仍看到画廊 + 模态框的叠加效果
                </li>
              </ol>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-800 p-5">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-blue-400" />
                <h3 className="font-semibold text-blue-400">硬导航（直接访问 URL / 刷新）</h3>
              </div>
              <ol className="flex flex-col gap-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-slate-400">1</span>
                  用户直接访问 <code className="rounded bg-slate-700 px-1 font-mono text-xs">/parallel-intercept/photo/1</code>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-slate-400">2</span>
                  拦截规则不生效，渲染 <code className="rounded bg-slate-700 px-1 font-mono text-xs">photo/[id]/page.tsx</code>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-slate-400">3</span>
                  <code className="rounded bg-slate-700 px-1 font-mono text-xs">@modal</code> 插槽回退到 <code className="rounded bg-slate-700 px-1 font-mono text-xs">default.tsx</code>（返回 null）
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-slate-400">4</span>
                  展示完整的照片详情页，可直接分享链接
                </li>
              </ol>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
