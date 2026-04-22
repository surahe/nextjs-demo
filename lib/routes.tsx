/* eslint-disable */
// AUTO-GENERATED FILE. DO NOT EDIT.
// Run: pnpm routes:gen

export type GeneratedRoute = {
    path: string;
    file: string;
    kind: 'page' | 'api';
};

export const APP_PAGE_ROUTES = [
    { path: '/', file: 'app/page.tsx', kind: 'page' as const },
    { path: '/dashboard', file: 'app/(admin)/dashboard/page.tsx', kind: 'page' as const },
    { path: '/file-structure', file: 'app/file-structure/page.tsx', kind: 'page' as const },
    { path: '/file-structure/[...slug]', file: 'app/file-structure/[...slug]/page.tsx', kind: 'page' as const },
    { path: '/login', file: 'app/login/page.tsx', kind: 'page' as const },
    { path: '/nuqs', file: 'app/nuqs/page.tsx', kind: 'page' as const },
    { path: '/parallel', file: 'app/parallel/page.tsx', kind: 'page' as const },
    { path: '/photos', file: 'app/photos/page.tsx', kind: 'page' as const },
    { path: '/photos/[id]', file: 'app/photos/[id]/page.tsx', kind: 'page' as const },
    { path: '/server-client', file: 'app/server-client/page.tsx', kind: 'page' as const },
    { path: '/suspense', file: 'app/suspense/page.tsx', kind: 'page' as const },
    { path: '/tailwind-directives', file: 'app/tailwind-directives/page.tsx', kind: 'page' as const },
    { path: '/zustand', file: 'app/zustand/page.tsx', kind: 'page' as const },
] as const;

export const APP_API_ROUTES = [
    { path: '/api/user/getInfo', file: 'app/api/user/getInfo/route.ts', kind: 'api' as const },
    { path: '/api/user/login', file: 'app/api/user/login/route.ts', kind: 'api' as const },
    { path: '/api/user/logout', file: 'app/api/user/logout/route.ts', kind: 'api' as const },
] as const;

export const APP_ROUTES: readonly GeneratedRoute[] = [
    ...APP_PAGE_ROUTES,
    ...APP_API_ROUTES,
];
