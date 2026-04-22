import type { RouteItem } from '@/types/routes';

/**
 * 菜单路由配置（可手工维护分级、显隐、图标键等业务属性）。
 * 路由有效性由 `lib/route-menu.ts` 结合 `lib/routes.tsx` 自动校验。
 */
export const ROUTE_MENU_CONFIG: RouteItem[] = [
    {
        title: '仪表盘',
        url: '/dashboard',
        iconKey: 'dashboard',
        activeIconKey: 'dashboard-active',
        isActive: true,
    },
    {
        title: '服务端与客户端',
        url: '/server-client',
        iconKey: 'server-client',
        isActive: true,
    },
    {
        title: 'nuqs URL 状态',
        url: '/nuqs',
        iconKey: 'nuqs',
        isActive: true,
    },
    {
        title: 'Tailwind 指令',
        url: '/tailwind-directives',
        iconKey: 'tailwind-directives',
        isActive: true,
    },
    {
        title: '图片路由',
        url: '/photos',
        iconKey: 'photos',
        isActive: true,
        items: [
            {
                title: '图片详情',
                url: '/photos/[id]',
                hideInMenu: true,
            },
        ],
    },
    {
        title: '文件结构演示',
        url: '/file-structure',
        iconKey: 'file-structure',
        isActive: true,
        items: [
            {
                title: '动态层级',
                url: '/file-structure/[[...slug]]',
                hideInMenu: true,
            },
        ],
    },
    {
        title: 'Zustand',
        url: '/zustand',
        iconKey: 'zustand',
        isActive: true,
    },
];
