'use client';

import Link from 'next/link';
import { parseAsInteger, parseAsString, useQueryState, useQueryStates } from 'nuqs';
import { nuqsParsers, type NuqsInitialState } from '../search-params.server';

const clientMethodDocs = [
    {
        name: 'useQueryState',
        desc: '绑定单个 query 参数到 React state，读写会同步 URL。',
        code: `const [keyword, setKeyword] = useQueryState(
  'keyword',
  parseAsString.withDefault('').withOptions({ shallow: false })
);`,
    },
    {
        name: 'useQueryStates',
        desc: '一次性管理多个 query 参数，适合筛选条件组合。',
        code: `const [filters, setFilters] = useQueryStates({
  sort: parseAsString.withDefault('newest').withOptions({ shallow: false }),
  size: parseAsInteger.withDefault(20).withOptions({ shallow: false }),
});`,
    },
    {
        name: 'parseAsInteger',
        desc: '将 URL 参数按整数解析，避免手动 Number 转换。',
        code: `const [page, setPage] = useQueryState(
  'page',
  parseAsInteger.withDefault(1).withOptions({ shallow: false })
);`,
    },
    {
        name: 'parseAsString',
        desc: '将 URL 参数按字符串解析，常用于 keyword/sort 等字段。',
        code: `const [keyword] = useQueryState(
  'keyword',
  parseAsString.withDefault('').withOptions({ shallow: false })
);`,
    },
    {
        name: 'withDefault',
        desc: '给 parser 设置默认值，缺省 query 时返回稳定初始值。',
        code: `parseAsInteger.withDefault(1)
parseAsString.withDefault('newest')`,
    },
    {
        name: 'withOptions',
        desc: '给 parser 增加行为选项，常用属性可按需组合。',
        code: `parseAsInteger.withDefault(1).withOptions({ history: 'push', shallow: false })
parseAsString.withDefault('').withOptions({ clearOnDefault: true, shallow: false })`,
    },
];

const withOptionsProps = [
    {
        name: 'history',
        desc: '控制浏览器历史栈策略（push 或 replace）。',
        code: `parseAsInteger.withDefault(1).withOptions({ history: 'push' })`,
    },
    {
        name: 'shallow',
        desc: '是否仅浅更新路由。Next 项目中依赖服务端数据时常设为 false。',
        code: `parseAsString.withDefault('').withOptions({ shallow: false })`,
    },
    {
        name: 'clearOnDefault',
        desc: '当值等于默认值时，从 URL 中移除该参数。',
        code: `parseAsString.withDefault('newest').withOptions({ clearOnDefault: true })`,
    },
    {
        name: 'scroll',
        desc: 'URL 更新后是否滚动到页面顶部。',
        code: `parseAsInteger.withDefault(1).withOptions({ scroll: false })`,
    },
];

const serverMethodDocs = [
    {
        name: 'createSearchParamsCache',
        desc: '在 Server Component 中解析并缓存 searchParams，减少重复解析。',
        code: `import { createSearchParamsCache, parseAsInteger, parseAsString } from 'nuqs/server';

const cache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  keyword: parseAsString.withDefault(''),
});

const parsed = cache.parse(await searchParams);
const { page, keyword } = parsed;

// 用解析后的参数做服务端请求
const list = await getProductList({ page, keyword });

// 再把初始参数和数据传给 Client Component
return <NuqsDemoClient initial={parsed} initialList={list} />;`,
    },
];

export function NuqsClientPreview({ initial }: { initial: NuqsInitialState }) {
    const [keyword, setKeyword] = useQueryState(
        'keyword',
        nuqsParsers.keyword.withOptions({ clearOnDefault: true, shallow: false }),
    );
    const [page, setPage] = useQueryState(
        'page',
        nuqsParsers.page.withOptions({ history: 'push', shallow: false }),
    );
    const [filters, setFilters] = useQueryStates({
        sort: parseAsString
            .withDefault('newest')
            .withOptions({ clearOnDefault: true, shallow: false }),
        size: parseAsInteger.withDefault(20).withOptions({ history: 'replace', shallow: false }),
    });

    return (
        <div className="min-h-screen bg-zinc-50 p-8 dark:bg-zinc-950">
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                        nuqs URL 状态演示
                    </h1>
                    <Link
                        href="/"
                        className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                        返回首页
                    </Link>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                        服务端 createSearchParamsCache 解析结果
                    </p>
                    <pre className="rounded-md bg-zinc-900 p-3 text-sm text-zinc-200">
                        {JSON.stringify(initial, null, 2)}
                    </pre>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                        本页方法简介（按运行端区分）
                    </p>
                    <div className="space-y-5">
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                                客户端（Client Component）示例
                            </p>
                            {clientMethodDocs.map((item) => (
                                <div
                                    key={item.name}
                                    className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700"
                                >
                                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                                        {item.name}
                                    </p>
                                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                                        {item.desc}
                                    </p>
                                    <pre className="mt-2 overflow-auto rounded-md bg-zinc-900 p-3 text-xs text-zinc-200">
                                        {item.code}
                                    </pre>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                                服务端（Server Component）示例
                            </p>
                            {serverMethodDocs.map((item) => (
                                <div
                                    key={item.name}
                                    className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700"
                                >
                                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                                        {item.name}
                                    </p>
                                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                                        {item.desc}
                                    </p>
                                    <pre className="mt-2 overflow-auto rounded-md bg-zinc-900 p-3 text-xs text-zinc-200">
                                        {item.code}
                                    </pre>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                        withOptions 属性清单
                    </p>
                    <div className="space-y-3">
                        {withOptionsProps.map((item) => (
                            <div
                                key={item.name}
                                className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700"
                            >
                                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                                    {item.name}
                                </p>
                                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                                    {item.desc}
                                </p>
                                <pre className="mt-2 overflow-auto rounded-md bg-zinc-900 p-3 text-xs text-zinc-200">
                                    {item.code}
                                </pre>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                        服务端与客户端使用区别（含 shallow: false）
                    </p>
                    <ul className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                        <li>
                            - 客户端：
                            <code className="mx-1 rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">
                                useQueryState/useQueryStates
                            </code>
                            负责读写 URL；仅更新浏览器地址时可用默认浅更新。
                        </li>
                        <li>
                            - 服务端：
                            <code className="mx-1 rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">
                                createSearchParamsCache.parse(...)
                            </code>
                            在 Server Component 里解析 query，参与服务端渲染。
                        </li>
                        <li>
                            -
                            <code className="mx-1 rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">
                                shallow: false
                            </code>
                            ：每次 query 变更都触发一次完整导航与服务端重新取数，确保 SSR 数据与 URL
                            同步。
                        </li>
                        <li>
                            - 在 Next 项目里，只要页面内容依赖服务端
                            <code className="mx-1 rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">
                                searchParams
                            </code>
                            （筛选、分页、列表请求），通常都建议显式设置
                            <code className="mx-1 rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">
                                shallow: false
                            </code>
                            。
                        </li>
                    </ul>
                </div>

                <div className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                    <label className="grid gap-1">
                        <span className="text-sm text-zinc-600 dark:text-zinc-300">keyword</span>
                        <input
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                            placeholder="输入关键字写入 URL"
                        />
                    </label>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((value) => value + 1)}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white"
                        >
                            page + 1
                        </button>
                        <button
                            onClick={() => setPage(1)}
                            className="rounded-lg bg-zinc-700 px-3 py-2 text-sm font-medium text-white"
                        >
                            page 重置为 1
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() =>
                                setFilters({
                                    sort: 'price',
                                    size: 50,
                                })
                            }
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white"
                        >
                            设置 sort=price,size=50
                        </button>
                        <button
                            onClick={() =>
                                setFilters({
                                    sort: 'newest',
                                    size: 20,
                                })
                            }
                            className="rounded-lg bg-zinc-700 px-3 py-2 text-sm font-medium text-white"
                        >
                            恢复默认筛选
                        </button>
                    </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                        当前客户端解析值
                    </p>
                    <pre className="rounded-md bg-zinc-900 p-3 text-sm text-zinc-200">
                        {JSON.stringify({ keyword, page, filters }, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}
