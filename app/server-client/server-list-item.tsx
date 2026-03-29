import type { TableItem } from './mock';

export default function ServerListItem({ item }: { item: TableItem }) {
    return (
        <li className="flex items-center justify-between border-t px-4 py-3">
            <div className="flex items-center gap-4">
                <span className="inline-block w-10 text-zinc-500">#{item.id}</span>
                <span className="font-medium">{item.name}</span>
            </div>
            <span className={item.status === 'active' ? 'text-emerald-700' : 'text-zinc-600'}>
                {item.status === 'active' ? '启用' : '停用'}
            </span>
        </li>
    );
}
