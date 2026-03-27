"use client";

import { useEffect, useState } from "react";

/**
 * template.tsx — 重挂载层（Client Component）
 * 与 layout.tsx 的关键区别：每次导航到该路由段都会重新挂载，
 * state 不保留，useEffect 重新执行。
 */
export default function FileStructureTemplate({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mountTime, setMountTime] = useState("");
    const [mountCount, setMountCount] = useState(0);

    useEffect(() => {
        setMountTime(new Date().toLocaleTimeString("zh-CN"));
        setMountCount((c) => c + 1);
    }, []);

    return (
        <div className="rounded-xl border-2 border-blue-400 dark:border-blue-600">
            {/* Template 层可见标识 */}
            <div className="flex items-center justify-between rounded-t-[10px] border-b border-blue-300 bg-blue-50 px-4 py-2 dark:border-blue-700 dark:bg-blue-950">
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-500 px-3 py-0.5 text-xs font-bold text-white">
                        template.tsx
                    </span>
                    <span className="text-xs text-blue-700 dark:text-blue-300">
                        每次导航都会重新挂载，state 不保留
                    </span>
                </div>
                {mountTime && (
                    <span className="text-xs text-blue-500 dark:text-blue-400">
                        第 {mountCount} 次挂载 · {mountTime}
                    </span>
                )}
            </div>

            <div className="p-4">{children}</div>
        </div>
    );
}
