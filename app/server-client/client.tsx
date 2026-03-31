'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormInitData, TableResult, TableQuery, Status } from './mock';
import { fetchTable, updateItemStatus } from './mock';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import FormClient from './components/form-client';
import TableFilters from './components/table-filters';
import Pagination from './components/pagination';
import DataTable from './components/data-table';

type Props = {
    initialForm: FormInitData;
    initialTable: TableResult;
    initialTab?: 'table' | 'form';
    initialQuery?: {
        page: number;
        pageSize: number;
        keyword: string;
        status: 'all' | 'active' | 'inactive';
        sortBy: 'id' | 'name';
        sortOrder: 'asc' | 'desc';
    };
};

export default function ServerClientClient({
    initialForm,
    initialTable,
    initialTab = 'table',
    initialQuery,
}: Props) {
    const [activeTab, setActiveTab] = useState<'table' | 'form'>(initialTab);
    return (
        <div className="rounded-lg border p-4">
            <div className="mb-4 flex gap-2">
                <button
                    className={`rounded border px-4 py-2 ${activeTab === 'table' ? 'border-sky-700 bg-sky-600 text-white' : 'border-sky-200 bg-white text-sky-700'}`}
                    onClick={() => setActiveTab('table')}
                >
                    表格
                </button>
                <button
                    className={`rounded border px-4 py-2 ${activeTab === 'form' ? 'border-emerald-700 bg-emerald-600 text-white' : 'border-emerald-200 bg-white text-emerald-700'}`}
                    onClick={() => setActiveTab('form')}
                >
                    表单
                </button>
            </div>

            {activeTab === 'table' ? (
                <TableTab initial={initialTable} initialQuery={initialQuery} />
            ) : (
                <FormClient initial={initialForm} />
            )}
        </div>
    );
}

function TableTab({
    initial,
    initialQuery,
}: {
    initial: TableResult;
    initialQuery?: Props['initialQuery'];
}) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();
    const [page, setPage] = useState(initialQuery?.page ?? initial.page);
    const [pageSize, setPageSize] = useState(initialQuery?.pageSize ?? initial.pageSize);
    const [keyword, setKeyword] = useState(initialQuery?.keyword ?? '');
    const [status, setStatus] = useState<'all' | 'active' | 'inactive'>(
        initialQuery?.status ?? 'all',
    );
    const [sortBy, setSortBy] = useState<'id' | 'name'>(initialQuery?.sortBy ?? 'id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialQuery?.sortOrder ?? 'asc');
    const [data, setData] = useState<TableResult>(initial);
    const [loading, setLoading] = useState(false);

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(data.total / data.pageSize)),
        [data.total, data.pageSize],
    );

    async function runFetch(q: Partial<TableQuery> = {}) {
        setLoading(true);
        try {
            const res = await fetchTable({
                page: q.page ?? page,
                pageSize: q.pageSize ?? pageSize,
                keyword,
                status,
                sortBy,
                sortOrder,
                ...q,
            });
            setData(res);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setData(initial);
    }, [initial]);

    function syncUrl(next: Partial<TableQuery> = {}) {
        const params = new URLSearchParams(sp.toString());
        params.set('tab', 'table');
        params.set('page', String(next.page ?? page));
        params.set('ps', String(next.pageSize ?? pageSize));
        params.set('kw', (next as any).keyword ?? keyword ?? '');
        params.set('status', (next as any).status ?? status ?? 'all');
        params.set('sortBy', (next as any).sortBy ?? sortBy);
        params.set('order', (next as any).sortOrder ?? sortOrder);
        router.replace(`${pathname}?${params.toString()}`);
    }

    function onSearch() {
        const next = { page: 1 as number };
        setPage(next.page);
        runFetch(next);
        syncUrl(next);
    }

    function nextPage() {
        if (page < totalPages) {
            const p = page + 1;
            setPage(p);
            runFetch({ page: p });
            syncUrl({ page: p });
        }
    }

    function prevPage() {
        if (page > 1) {
            const p = page - 1;
            setPage(p);
            runFetch({ page: p });
            syncUrl({ page: p });
        }
    }

    function onChangePageSize(ps: number) {
        const p = 1;
        setPageSize(ps);
        setPage(p);
        runFetch({ page: p, pageSize: ps });
        syncUrl({ page: p, pageSize: ps });
    }

    function toggleSort(field: 'id' | 'name') {
        let nextOrder: 'asc' | 'desc' = 'asc';
        if (sortBy === field) {
            nextOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        }
        setSortBy(field);
        setSortOrder(nextOrder);
        const p = 1;
        setPage(p);
        runFetch({ page: p, sortBy: field, sortOrder: nextOrder });
        syncUrl({ page: p, sortBy: field, sortOrder: nextOrder });
    }

    async function toggleStatus(id: number) {
        const current = data.items.find((it) => it.id === id);
        if (!current) return;
        const next: Status = current.status === 'active' ? 'inactive' : 'active';
        const optimistic = {
            ...data,
            items: data.items.map((it) => (it.id === id ? { ...it, status: next } : it)),
        };
        setData(optimistic);
        try {
            const updated = await updateItemStatus(id, next);
            if (!updated) throw new Error('not found');
        } catch {
            setData(data);
        }
    }

    return (
        <div className="space-y-4">
            <TableFilters
                keyword={keyword}
                setKeyword={setKeyword}
                status={status}
                setStatus={setStatus}
                onSearch={onSearch}
            />
            <DataTable
                data={data}
                loading={loading}
                sortBy={sortBy}
                sortOrder={sortOrder}
                toggleSort={toggleSort}
                toggleStatus={toggleStatus}
            />
            <Pagination
                page={data.page}
                totalPages={totalPages}
                loading={loading}
                pageSize={pageSize}
                onChangePageSize={onChangePageSize}
                prevPage={prevPage}
                nextPage={nextPage}
            />
        </div>
    );
}
