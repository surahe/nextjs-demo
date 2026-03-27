import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
    const sectionClass = `mb-16 w-full max-w-2xl rounded-xl border bg-white p-6 text-left transition-shadow hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800`;

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                {/* Demo 导航 */}
                <div className="w-full">
                    <section className={sectionClass}>
                        <p className="mb-3 text-sm font-medium text-zinc-500 uppercase tracking-wide">
                            路由 Demo
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/parallel"
                                className="flex flex-col gap-1 rounded-xl border border-purple-200 bg-purple-50 px-5 py-4 transition-colors hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950 dark:hover:bg-purple-900"
                            >
                                <span className="font-semibold text-purple-800 dark:text-purple-200">
                                    并行路由 →
                                </span>
                                <span className="text-xs text-purple-600 dark:text-purple-400">
                                    @sidebar · children · @stats 三插槽仪表盘
                                </span>
                            </Link>
                            <Link
                                href="/photos"
                                className="flex flex-col gap-1 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950 dark:hover:bg-amber-900"
                            >
                                <span className="font-semibold text-amber-800 dark:text-amber-200">
                                    拦截路由 →
                                </span>
                                <span className="text-xs text-amber-600 dark:text-amber-400">
                                    图库点击弹窗 · 刷新渲染完整页
                                </span>
                            </Link>
                        </div>
                    </section>

                    <section className={sectionClass}>
                        <p className="mb-3 text-sm font-medium text-zinc-500 uppercase tracking-wide">
                            文件结构 Demo
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/file-structure"
                                className="flex flex-col gap-1 rounded-xl border border-green-200 bg-green-50 px-5 py-4 transition-colors hover:bg-green-100 dark:border-green-800 dark:bg-green-950 dark:hover:bg-green-900"
                            >
                                <span className="font-semibold text-green-800 dark:text-green-200">
                                    组件层级演示 →
                                </span>
                                <span className="text-xs text-green-600 dark:text-green-400">
                                    layout · template · error · loading · not-found · page
                                </span>
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
