import Link from 'next/link';
import { headers } from 'next/headers';
import { Suspense, type ReactNode } from 'react';
import { fetchFormInit, fetchTable } from './mock';
import ServerClientClient from './client';
import ServerMetrics from './server-metrics';
import ServerListContainer from './server-list-container';
import Structure from './structure';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
    const sp = Object.fromEntries(
        Object.entries(searchParams ?? {}).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
    ) as Record<string, string | undefined>;

    const initPage = Math.max(1, Number(sp.page ?? '1') || 1);
    const initPageSize = [5, 10, 20].includes(Number(sp.ps)) ? Number(sp.ps) : 5;
    const initKeyword = sp.kw ?? '';
    const initStatus = (sp.status as any) === 'active' || (sp.status as any) === 'inactive' ? (sp.status as any) : 'all';
    const initSortBy = sp.sortBy === 'name' ? 'name' : 'id';
    const initSortOrder = sp.order === 'desc' ? 'desc' : 'asc';
    const initTab = sp.tab === 'form' ? 'form' : sp.tab === 'server' ? 'server' : 'table';

    const [formInit, tableInit] = await Promise.all([
        fetchFormInit(),
        fetchTable({
            page: initPage,
            pageSize: initPageSize,
            keyword: initKeyword,
            status: initStatus as any,
            sortBy: initSortBy as any,
            sortOrder: initSortOrder as any,
        }),
    ]);

    const hs = await headers();
    const userAgent = hs.get('user-agent') ?? '';
    const cookieHeader = hs.get('cookie') ?? '';
    const cookiesCount = cookieHeader ? cookieHeader.split(';').filter((s) => s.trim()).length : 0;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-4">
                <Link
                    href="/"
                    className="inline-block rounded border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                    ← 返回首页
                </Link>
            </div>
            <h1 className="text-2xl font-semibold mb-2">Server 与 Client 组件示例</h1>
            <div className="text-zinc-600 dark:text-zinc-400 mb-6">
                <div>服务端获取初始化数据，客户端负责交互、筛选、翻页与提交。</div>
                <div className="text-xs mt-2">
                    UA: {userAgent.slice(0, 80)}…
                    {' · '}
                    Cookies: {cookiesCount}
                </div>
            </div>
            <Suspense fallback={<div className="mb-4 rounded border px-3 py-2 text-sm text-zinc-600">统计加载中…</div>}>
                <ServerMetrics />
            </Suspense>
            <Structure />
            <div className="mb-4 flex gap-2">
                <TabButton href={`/server-client?tab=server&page=${initPage}&ps=${initPageSize}`} active={initTab === 'server'} color="indigo">
                    只读列表（Server）
                </TabButton>
                <TabButton href={`/server-client?tab=table&page=${initPage}&ps=${initPageSize}`} active={initTab === 'table'} color="sky">
                    交互表格（Client）
                </TabButton>
                <TabButton href={`/server-client?tab=form&page=${initPage}&ps=${initPageSize}`} active={initTab === 'form'} color="emerald">
                    表单（Client）
                </TabButton>
            </div>
            {initTab === 'server' ? (
                <ServerListContainer
                    query={{
                        page: initPage,
                        pageSize: initPageSize,
                        keyword: initKeyword,
                        status: initStatus as 'all' | 'active' | 'inactive',
                        sortBy: initSortBy as 'id' | 'name',
                        sortOrder: initSortOrder as 'asc' | 'desc',
                    }}
                />
            ) : (
                <ServerClientClient
                    initialForm={formInit}
                    initialTable={tableInit}
                    initialTab={initTab === 'form' ? 'form' : 'table'}
                    initialQuery={{
                        page: initPage,
                        pageSize: initPageSize,
                        keyword: initKeyword,
                        status: initStatus as 'all' | 'active' | 'inactive',
                        sortBy: initSortBy as 'id' | 'name',
                        sortOrder: initSortOrder as 'asc' | 'desc',
                    }}
                />
            )}
        </div>
    );
}

function TabButton({
    href,
    active,
    color,
    children,
}: {
    href: string;
    active: boolean;
    color: 'indigo' | 'sky' | 'emerald';
    children: ReactNode;
}) {
    const styles = {
        indigo: {
            border: 'border-indigo-200 dark:border-indigo-800',
            bg: active ? 'bg-indigo-600 text-white' : 'bg-indigo-50 dark:bg-indigo-950',
            hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900',
            text: active ? '' : 'text-indigo-700 dark:text-indigo-300',
        },
        sky: {
            border: 'border-sky-200 dark:border-sky-800',
            bg: active ? 'bg-sky-600 text-white' : 'bg-sky-50 dark:bg-sky-950',
            hover: active ? 'hover:bg-sky-700' : 'hover:bg-sky-200 dark:hover:bg-sky-800',
            text: active ? '' : 'text-sky-700 dark:text-sky-300',
        },
        emerald: {
            border: 'border-emerald-200 dark:border-emerald-800',
            bg: active ? 'bg-emerald-600 text-white' : 'bg-emerald-50 dark:bg-emerald-950',
            hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900',
            text: active ? '' : 'text-emerald-700 dark:text-emerald-300',
        },
    } as const;
    const map = styles[color];
    return (
        <Link
            href={href}
            className={`rounded border px-4 py-2 ${map.border} ${map.bg} ${map.hover} ${map.text}`}
        >
            {children}
        </Link>
    );
}
