const navItems = [
    { icon: '🏠', label: '概览', active: true },
    { icon: '📊', label: '数据分析', active: false },
    { icon: '👥', label: '用户管理', active: false },
    { icon: '📦', label: '订单列表', active: false },
    { icon: '📝', label: '内容管理', active: false },
    { icon: '⚙️', label: '系统设置', active: false },
];

export default function SidebarPage() {
    return (
        <div className="p-4">
            {/* 插槽标识 */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300">
                <span className="size-2 rounded-full bg-purple-500" />
                插槽：@sidebar
            </div>

            <p className="mb-4 text-xs text-zinc-500">app/parallel/@sidebar/page.tsx</p>

            <nav className="space-y-1">
                {navItems.map((item) => (
                    <div
                        key={item.label}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                            item.active
                                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                        }`}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </nav>
        </div>
    );
}
