const stats = [
    { label: '总用户数', value: '12,430', delta: '+8.1%', up: true },
    { label: '本月订单', value: '3,201', delta: '+12.4%', up: true },
    { label: '营收（万元）', value: '89.45', delta: '-2.3%', up: false },
    { label: '转化率', value: '3.6%', delta: '+0.4%', up: true },
];

const activityLog = [
    { user: 'Alice', action: '新增订单 #10291', time: '2 分钟前' },
    { user: 'Bob', action: '修改了商品库存', time: '15 分钟前' },
    { user: 'Carol', action: '创建新用户', time: '1 小时前' },
];

export default function StatsPage() {
    return (
        <div>
            {/* 插槽标识 */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
                <span className="size-2 rounded-full bg-green-500" />
                插槽：@stats
            </div>

            <p className="mb-4 text-xs text-zinc-500">
                app/parallel/@stats/page.tsx
            </p>

            {/* 数字统计 */}
            <div className="mb-6 grid grid-cols-2 gap-2">
                {stats.map((s) => (
                    <div
                        key={s.label}
                        className="rounded-xl border p-3 dark:border-zinc-800"
                    >
                        <p className="text-xs text-zinc-500">{s.label}</p>
                        <p className="mt-1 text-lg font-bold text-zinc-800 dark:text-zinc-100">
                            {s.value}
                        </p>
                        <span
                            className={`text-xs font-medium ${
                                s.up ? 'text-green-600' : 'text-red-500'
                            }`}
                        >
                            {s.delta}
                        </span>
                    </div>
                ))}
            </div>

            {/* 活动日志 */}
            <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                最近活动
            </h3>
            <div className="space-y-2">
                {activityLog.map((log, i) => (
                    <div
                        key={i}
                        className="rounded-lg border p-3 text-xs dark:border-zinc-800"
                    >
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                            {log.user}
                        </span>
                        <span className="mx-1 text-zinc-500">{log.action}</span>
                        <span className="text-zinc-400">{log.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
