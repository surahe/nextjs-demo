'use client';

import type { TableResult } from '../mock';

type Props = {
    data: TableResult;
    loading: boolean;
    sortBy: 'id' | 'name';
    sortOrder: 'asc' | 'desc';
    toggleSort: (field: 'id' | 'name') => void;
    toggleStatus: (id: number) => void;
};

export default function DataTable({ data, loading, sortBy, sortOrder, toggleSort, toggleStatus }: Props) {
    return (
        <div className="rounded border overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-zinc-100">
                    <tr>
                        <th className="px-4 py-2">
                            <button className="underline underline-offset-2" onClick={() => toggleSort('id')} title="按 ID 排序">
                                ID {sortBy === 'id' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </button>
                        </th>
                        <th className="px-4 py-2">
                            <button className="underline underline-offset-2" onClick={() => toggleSort('name')} title="按名称排序">
                                名称 {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </button>
                        </th>
                        <th className="px-4 py-2">状态</th>
                        <th className="px-4 py-2">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-zinc-500">
                                加载中…
                            </td>
                        </tr>
                    ) : data.items.length ? (
                        data.items.map((it) => (
                            <tr key={it.id} className="border-t">
                                <td className="px-4 py-2">{it.id}</td>
                                <td className="px-4 py-2">{it.name}</td>
                                <td className="px-4 py-2">
                                    <span className={it.status === 'active' ? 'text-emerald-700' : 'text-zinc-600'}>
                                        {it.status === 'active' ? '启用' : '停用'}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => toggleStatus(it.id)}
                                        disabled={loading}
                                        className="px-3 py-1 rounded border bg-white hover:bg-zinc-50"
                                    >
                                        切换状态
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-zinc-500">
                                暂无数据
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
