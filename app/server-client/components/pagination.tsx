'use client';

type Props = {
    page: number;
    totalPages: number;
    loading: boolean;
    pageSize: number;
    onChangePageSize: (ps: number) => void;
    prevPage: () => void;
    nextPage: () => void;
};

export default function Pagination({
    page,
    totalPages,
    loading,
    pageSize,
    onChangePageSize,
    prevPage,
    nextPage,
}: Props) {
    return (
        <div className="flex items-center justify-between border-t bg-white px-4 py-3">
            <div className="text-sm text-zinc-600">
                第 {page}/{totalPages} 页
            </div>
            <div className="flex items-center gap-3">
                <label className="text-sm text-zinc-600">每页</label>
                <select
                    className="rounded border px-2 py-1"
                    value={pageSize}
                    onChange={(e) => onChangePageSize(Number(e.target.value))}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
                <div className="h-4 w-px bg-zinc-200" />
                <button
                    onClick={prevPage}
                    disabled={loading || page <= 1}
                    className={`rounded border px-3 py-1 ${page <= 1 ? 'bg-zinc-100 text-zinc-400' : 'bg-white hover:bg-zinc-50'}`}
                >
                    上一页
                </button>
                <button
                    onClick={nextPage}
                    disabled={loading || page >= totalPages}
                    className={`rounded border px-3 py-1 ${page >= totalPages ? 'bg-zinc-100 text-zinc-400' : 'bg-white hover:bg-zinc-50'}`}
                >
                    下一页
                </button>
            </div>
        </div>
    );
}
