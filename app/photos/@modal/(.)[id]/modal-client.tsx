'use client';

import { useRouter } from 'next/navigation';
import { PHOTOS } from '../../data';

export default function PhotoModal({
    photo,
    id,
}: {
    photo: (typeof PHOTOS)[number];
    id: string;
}) {
    const router = useRouter();

    return (
        // 遮罩层
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 半透明背景，点击关闭 */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => router.back()}
            />

            {/* 弹窗内容 */}
            <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
                {/* 拦截路由标识 */}
                <div className="border-b bg-amber-50 px-4 py-2 text-xs text-amber-700 dark:border-zinc-700 dark:bg-amber-950 dark:text-amber-300">
                    🪄 拦截路由 — 当前 URL 已是{' '}
                    <code className="font-mono">/photos/{id}</code>
                    ，但仍在图库页
                </div>

                {/* 图片区 */}
                <div
                    className={`${photo.color} flex h-48 items-center justify-center text-7xl`}
                >
                    {photo.emoji}
                </div>

                {/* 信息区 */}
                <div className="p-5">
                    <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                        {photo.title}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">Photo #{id}</p>
                    <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                        这是拦截路由弹窗。刷新页面或直接访问此
                        URL，将渲染完整详情页。
                    </p>

                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => router.back()}
                            className="flex-1 rounded-xl border py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                            关闭
                        </button>
                        <a
                            href={`/photos/${id}`}
                            className="flex-1 rounded-xl bg-zinc-900 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                            查看完整页面 →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
