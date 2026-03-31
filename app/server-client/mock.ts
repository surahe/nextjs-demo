type DelayOptions = {
    ms?: number;
};

function delay({ ms = 600 }: DelayOptions = {}) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export type Gender = 'male' | 'female';

export type FormInitData = {
    username: string;
    gender: Gender;
    serverNote: string;
};

export async function fetchFormInit(): Promise<FormInitData> {
    await delay({ ms: 500 });
    const now = new Date().toLocaleString();
    return {
        username: 'Alice',
        gender: 'female',
        serverNote: `初始化于 ${now}`,
    };
}

export type SubmitFormInput = {
    username: string;
    gender: Gender;
};

export type SubmitFormResult = {
    ok: boolean;
    message: string;
    submittedAt: string;
    payload: SubmitFormInput;
};

export async function submitForm(input: SubmitFormInput): Promise<SubmitFormResult> {
    await delay({ ms: 800 });
    const submittedAt = new Date().toLocaleString();
    return {
        ok: true,
        message: '提交成功',
        submittedAt,
        payload: input,
    };
}

export type Status = 'active' | 'inactive';

export type TableItem = {
    id: number;
    name: string;
    status: Status;
};

export type TableQuery = {
    page: number;
    pageSize: number;
    keyword?: string;
    status?: 'all' | Status;
    sortBy?: 'id' | 'name';
    sortOrder?: 'asc' | 'desc';
};

export type TableResult = {
    items: TableItem[];
    total: number;
    page: number;
    pageSize: number;
};

function generateDataset(count = 57): TableItem[] {
    const items: TableItem[] = [];
    for (let i = 1; i <= count; i++) {
        items.push({
            id: i,
            name: `条目 ${i}`,
            status: i % 3 === 0 ? 'inactive' : 'active',
        });
    }
    return items;
}

const DATASET: TableItem[] = generateDataset();

export async function fetchTable(query: TableQuery): Promise<TableResult> {
    const {
        page,
        pageSize,
        keyword = '',
        status = 'all',
        sortBy = 'id',
        sortOrder = 'asc',
    } = query;
    await delay({ ms: 700 });
    const kw = keyword.trim();
    let data = DATASET;
    if (status !== 'all') {
        data = data.filter((d) => d.status === status);
    }
    if (kw) {
        data = data.filter((d) => d.name.includes(kw));
    }
    data = [...data].sort((a, b) => {
        const dir = sortOrder === 'asc' ? 1 : -1;
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name) * dir;
        }
        return (a.id - b.id) * dir;
    });
    const total = data.length;
    const start = (page - 1) * pageSize;
    const items = data.slice(start, start + pageSize);
    return {
        items,
        total,
        page,
        pageSize,
    };
}

export async function updateItemStatus(id: number, next: Status): Promise<TableItem | null> {
    await delay({ ms: 600 });
    const idx = DATASET.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    DATASET[idx] = { ...DATASET[idx], status: next };
    return DATASET[idx];
}

export type ServerMetrics = {
    total: number;
    active: number;
    inactive: number;
    generatedAt: string;
};

export async function fetchServerMetrics(): Promise<ServerMetrics> {
    await delay({ ms: 900 });
    const total = DATASET.length;
    const active = DATASET.filter((d) => d.status === 'active').length;
    const inactive = total - active;
    return {
        total,
        active,
        inactive,
        generatedAt: new Date().toLocaleString(),
    };
}
