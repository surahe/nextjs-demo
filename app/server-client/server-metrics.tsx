import { fetchServerMetrics } from './mock';

export default async function ServerMetrics() {
    const m = await fetchServerMetrics();
    return (
        <div className="mb-6 rounded border px-4 py-3 bg-zinc-50">
            <div className="text-sm">
                服务器统计：共 {m.total} 条 · 启用 {m.active} 条 · 停用 {m.inactive} 条
            </div>
            <div className="text-xs text-zinc-500">生成于 {m.generatedAt}</div>
        </div>
    );
}
