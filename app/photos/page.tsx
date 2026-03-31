import Link from 'next/link';
import { PHOTOS } from './data';

export default function PhotosPage() {
    return (
        <div className="min-h-screen bg-zinc-50 p-6 font-sans dark:bg-zinc-950">
            {/* 页头 */}
            <div className="mb-2 flex items-center gap-3">
                <Link
                    href="/"
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                >
                    ← 返回
                </Link>
                <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                    拦截路由 Demo
                </h1>
            </div>

            {/* 说明 */}
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                <p className="mb-1 font-semibold">👆 点击任意图片卡片</p>
                <p>
                    软导航（点击）：URL 变为{' '}
                    <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">
                        /photos/[id]
                    </code>
                    ，但页面不跳转，在{' '}
                    <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">@modal</code>{' '}
                    插槽里显示弹窗。
                </p>
                <p className="mt-1">
                    硬导航（刷新或直接访问 URL）：正常渲染完整图片详情页，不显示弹窗。
                </p>
            </div>

            {/* 图片网格 */}
            <div className="grid grid-cols-3 gap-4">
                {PHOTOS.map((photo) => (
                    <Link
                        key={photo.id}
                        href={`/photos/${photo.id}`}
                        className="group block overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        {/* 色块代替真实图片 */}
                        <div
                            className={`${photo.color} flex h-40 items-center justify-center text-5xl`}
                        >
                            {photo.emoji}
                        </div>
                        <div className="p-3">
                            <p className="font-medium text-zinc-800 dark:text-zinc-100">
                                {photo.title}
                            </p>
                            <p className="text-xs text-zinc-400">Photo #{photo.id}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
