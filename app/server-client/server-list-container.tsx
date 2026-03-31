import Link from 'next/link';
import { fetchTable } from './mock';
import ServerListItem from './server-list-item';

type Query = {
    page: number;
    pageSize: number;
    keyword: string;
    status: 'all' | 'active' | 'inactive';
    sortBy: 'id' | 'name';
    sortOrder: 'asc' | 'desc';
};

export default async function ServerListContainer({ query }: { query: Query }) {
    const data = await fetchTable(query);
    const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
    const prev = Math.max(1, data.page - 1);
    const next = Math.min(totalPages, data.page + 1);
    return (
        <div className="overflow-hidden rounded border">
            <div className="bg-zinc-100 px-4 py-3 text-sm text-zinc-600">
                只读列表（Server 渲染）：共 {data.total} 条 · 第 {data.page}/{totalPages} 页
            </div>
            <ul>
                {data.items.map((it) => (
                    <ServerListItem key={it.id} item={it} />
                ))}
                {!data.items.length ? (
                    <li className="px-4 py-6 text-center text-zinc-500">暂无数据</li>
                ) : null}
            </ul>
            <div className="flex items-center justify-between border-t bg-white px-4 py-3">
                <Link
                    href={`/server-client?tab=server&page=${prev}&ps=${data.pageSize}`}
                    className={`rounded border px-3 py-1 ${data.page <= 1 ? 'pointer-events-none bg-zinc-100 text-zinc-400' : 'bg-white hover:bg-zinc-50'}`}
                    aria-disabled={data.page <= 1}
                >
                    上一页
                </Link>
                <Link
                    href={`/server-client?tab=server&page=${next}&ps=${data.pageSize}`}
                    className={`rounded border px-3 py-1 ${data.page >= totalPages ? 'pointer-events-none bg-zinc-100 text-zinc-400' : 'bg-white hover:bg-zinc-50'}`}
                    aria-disabled={data.page >= totalPages}
                >
                    下一页
                </Link>
            </div>
        </div>
    );
}
