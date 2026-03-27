import Link from 'next/link';
import { PHOTOS } from '../data';
import { notFound } from 'next/navigation';

export default async function PhotoDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const photo = PHOTOS.find((p) => p.id === id);
    if (!photo) notFound();

    return (
        <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950 flex flex-col">
            {/* 说明栏：硬导航时才会看到这个完整页面 */}
            <div className="border-b bg-white px-6 py-3 flex items-center gap-4 dark:bg-zinc-900">
                <Link
                    href="/photos"
                    className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                    ← 返回图库
                </Link>
                <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                    直接访问 URL 或刷新时渲染此完整页面（无弹窗）
                </span>
            </div>

            <div className="flex flex-1 items-center justify-center p-10">
                <div className="max-w-md w-full overflow-hidden rounded-2xl border bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                    <div
                        className={`${photo.color} flex h-64 items-center justify-center text-8xl`}
                    >
                        {photo.emoji}
                    </div>
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                            {photo.title}
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            Photo #{photo.id}
                        </p>
                        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                            这是完整详情页。当你从图库点击进来时，拦截路由会让此内容以弹窗形式呈现，而不是跳转到这个页面。
                        </p>
                        <Link
                            href="/photos"
                            className="mt-6 block w-full rounded-xl bg-zinc-900 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                            返回图库
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
