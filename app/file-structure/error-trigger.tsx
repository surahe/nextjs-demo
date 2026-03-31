'use client';

import { useState } from 'react';

/**
 * 客户端组件：按下按钮后抛出错误，由父级 error.tsx 捕获。
 */
export default function ErrorTrigger() {
    const [shouldThrow, setShouldThrow] = useState(false);

    if (shouldThrow) {
        throw new Error('手动触发的错误，已被 error.tsx 捕获！');
    }

    return (
        <button
            onClick={() => setShouldThrow(true)}
            className="rounded-xl border-2 border-red-300 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 dark:border-red-700 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
        >
            ⚠️ 抛出错误（触发 error.tsx）
        </button>
    );
}
