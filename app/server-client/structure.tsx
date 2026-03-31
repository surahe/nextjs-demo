type Kind = 'server' | 'client';

type Node = {
    title: string;
    file: string;
    kind: Kind;
    children?: Node[];
};

const tree: Node = {
    title: 'Page',
    file: 'page.tsx',
    kind: 'server',
    children: [
        { title: 'ServerMetrics', file: 'server-metrics.tsx', kind: 'server' },
        {
            title: 'Tabs (导航)',
            file: 'page.tsx',
            kind: 'server',
            children: [
                {
                    title: 'ServerListContainer',
                    file: 'server-list-container.tsx',
                    kind: 'server',
                    children: [
                        { title: 'ServerListItem', file: 'server-list-item.tsx', kind: 'server' },
                    ],
                },
                {
                    title: 'ClientTabs 容器',
                    file: 'client.tsx',
                    kind: 'client',
                    children: [
                        {
                            title: 'TableTab',
                            file: 'client.tsx',
                            kind: 'client',
                            children: [
                                {
                                    title: 'TableFilters',
                                    file: 'components/table-filters.tsx',
                                    kind: 'client',
                                },
                                {
                                    title: 'DataTable',
                                    file: 'components/data-table.tsx',
                                    kind: 'client',
                                },
                                {
                                    title: 'Pagination',
                                    file: 'components/pagination.tsx',
                                    kind: 'client',
                                },
                            ],
                        },
                        { title: 'FormClient', file: 'components/form-client.tsx', kind: 'client' },
                    ],
                },
            ],
        },
    ],
};

function Badge({ kind }: { kind: Kind }) {
    const map: Record<Kind, string> = {
        server: 'border-emerald-300 text-emerald-700 bg-emerald-50',
        client: 'border-sky-300 text-sky-700 bg-sky-50',
    };
    const label: Record<Kind, string> = { server: 'Server', client: 'Client' };
    return (
        <span className={`ml-2 inline-block rounded border px-2 py-0.5 text-xs ${map[kind]}`}>
            {label[kind]}
        </span>
    );
}

function Row({ node, depth = 0 }: { node: Node; depth?: number }) {
    return (
        <li className="py-1">
            <div className="flex items-center">
                <span className="font-mono text-sm" style={{ paddingLeft: depth * 16 }}>
                    {node.title} — {node.file}
                </span>
                <Badge kind={node.kind} />
            </div>
            {node.children?.length ? (
                <ul>
                    {node.children.map((child, idx) => (
                        <Row key={`${node.title}-${idx}`} node={child} depth={(depth ?? 0) + 1} />
                    ))}
                </ul>
            ) : null}
        </li>
    );
}

export default async function Structure() {
    return (
        <div className="mb-6 rounded border">
            <div className="bg-zinc-100 px-4 py-2 text-sm text-zinc-700">
                页面内容结构（含文件名与类型）
            </div>
            <ul className="px-2 py-2">
                <Row node={tree} />
            </ul>
        </div>
    );
}
