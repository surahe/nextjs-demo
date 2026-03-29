'use client';

type Props = {
    keyword: string;
    setKeyword: (v: string) => void;
    status: 'all' | 'active' | 'inactive';
    setStatus: (v: 'all' | 'active' | 'inactive') => void;
    onSearch: () => void;
};

export default function TableFilters({ keyword, setKeyword, status, setStatus, onSearch }: Props) {
    return (
        <div className="rounded border p-3 bg-zinc-50">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                    <label className="block text-sm mb-1">关键词</label>
                    <input
                        className="w-full rounded border px-3 py-2"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="输入关键词"
                    />
                </div>
                <div className="sm:w-64">
                    <label className="block text-sm mb-1">状态</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="status" value="all" checked={status === 'all'} onChange={() => setStatus('all')} />
                            <span>全部</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="status" value="active" checked={status === 'active'} onChange={() => setStatus('active')} />
                            <span>启用</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="status" value="inactive" checked={status === 'inactive'} onChange={() => setStatus('inactive')} />
                            <span>停用</span>
                        </label>
                    </div>
                </div>
                <button onClick={onSearch} className="h-[42px] px-4 rounded bg-sky-600 text-white hover:bg-sky-700">
                    查询
                </button>
            </div>
        </div>
    );
}
