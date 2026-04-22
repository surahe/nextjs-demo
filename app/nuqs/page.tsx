import type { SearchParams } from 'nuqs/server';
import { NuqsServerPreview } from './components/server-preview';
import { searchParamsCache } from './search-params.server';
import { NuqsClientPreview } from './components/client-preview';

type NuqsPageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function NuqsPage({ searchParams }: NuqsPageProps) {
    const initial = await searchParamsCache.parse(searchParams);

    return (
        <>
            <NuqsServerPreview />
            <NuqsClientPreview initial={initial} />
        </>
    );
}
