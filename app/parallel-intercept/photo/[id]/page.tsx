import Link from 'next/link';
import { getPhotoById, photos } from '../../data';
import { notFound } from 'next/navigation';

export default async function PhotoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const foundPhoto = getPhotoById(id);

  if (!foundPhoto) {
    notFound();
  }

  // TypeScript narrowing: notFound() is `never` when Next.js types are installed;
  // using non-null assertion to satisfy the compiler in environments without full type declarations
  const photo = foundPhoto!;

  return (
    <div className="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-12">
        {/* 返回按钮 */}
        <Link
          href="/parallel-intercept"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回照片库
        </Link>

        {/* 照片展示 */}
        <div className="overflow-hidden rounded-3xl shadow-xl">
          <div className={`flex h-80 items-center justify-center bg-gradient-to-br ${photo.color}`}>
            <span className="text-9xl">{photo.emoji}</span>
          </div>
        </div>

        {/* 照片信息 */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{photo.title}</h1>
            <p className="mt-1 text-slate-400">{photo.subtitle}</p>
          </div>
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">{photo.desc}</p>
        </div>

        {/* 提示标签 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">你正在查看完整详情页</p>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                这是通过<strong>硬导航</strong>（直接访问 URL 或刷新页面）进入的完整照片页面（<code className="font-mono">photo/[id]/page.tsx</code>）。此时拦截路由不生效，<code className="font-mono">@modal</code> 插槽回退到 <code className="font-mono">default.tsx</code>（返回 null）。返回照片库后再点击同一张照片，将触发拦截路由弹出模态框，体验两种渲染方式的区别。
              </p>
            </div>
          </div>
        </div>

        {/* 其他照片 */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">其他照片</h2>
          <div className="grid grid-cols-3 gap-3">
            {photos
              .filter((p) => p.id !== id)
              .slice(0, 3)
              .map((p) => (
                <Link
                  key={p.id}
                  href={`/parallel-intercept/photo/${p.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className={`flex h-20 items-center justify-center bg-gradient-to-br ${p.color}`}>
                    <span className="text-3xl">{p.emoji}</span>
                  </div>
                  <div className="p-2">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{p.title}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
