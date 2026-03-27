'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getPhotoById } from '../../../data';

export default function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  // params is a Promise in Next.js 15+ — use React.use() to unwrap it in client components
  const { id } = React.use(params);

  const photo = getPhotoById(id);

  if (!photo) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => router.back()}
      />

      {/* Modal card */}
      <div className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        {/* Cover */}
        <div className={`flex h-56 items-center justify-center bg-gradient-to-br ${photo.color}`}>
          <span className="text-8xl">{photo.emoji}</span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{photo.title}</h2>
              <p className="text-sm text-slate-400">{photo.subtitle}</p>
            </div>
            <button
              onClick={() => router.back()}
              className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              aria-label="关闭"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{photo.desc}</p>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
            <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
              <span className="text-violet-500">@modal</span> 插槽 ·{' '}
              <span className="text-emerald-500">(.)photo</span> 拦截路由 · 刷新页面查看完整版
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
