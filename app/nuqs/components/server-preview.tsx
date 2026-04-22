import { searchParamsCache } from '../search-params.server';

export function NuqsServerPreview() {
    const page = searchParamsCache.get('page');
    const keyword = searchParamsCache.get('keyword');

    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                服务端子组件读取（searchParamsCache.get）
            </p>
            <pre className="rounded-md bg-zinc-900 p-3 text-sm text-zinc-200">
                {JSON.stringify({ page, keyword }, null, 2)}
            </pre>
        </div>
    );
}
