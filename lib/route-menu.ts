import { APP_PAGE_ROUTES } from '@/lib/routes';
import { ROUTE_MENU_CONFIG } from '@/lib/route-menu.config';
import type { RouteItem, RouteValidationResult } from '@/types/routes';

/**
 * 统一路径格式：
 * - 空值兜底为 `/`
 * - 合并重复斜杠
 * - 去掉末尾斜杠（根路径除外）
 */
function normalizePath(path: string) {
    if (!path) return '/';
    const normalized = path.trim().replace(/\/+/g, '/').replace(/\/$/, '');
    return normalized || '/';
}

/**
 * 按路径段拆分（不包含空段），用于后续动态段识别与前缀计算。
 */
function splitPath(path: string) {
    return normalizePath(path).split('/').filter(Boolean);
}

/**
 * 判断单个路径段是否为“动态段”：
 * - 配置风格：`:id`
 * - Next 风格：`[id]`、`[...slug]`、`[[...slug]]`
 */
function isDynamicSegment(segment: string) {
    return segment.startsWith(':') || /^\[.*\]$/.test(segment);
}

/**
 * 判断整条路径是否包含任意动态段。
 */
function hasDynamicSegment(path: string) {
    return splitPath(path).some(isDynamicSegment);
}

/**
 * 提取静态前缀：
 * 例如 `/photos/[id]` -> `/photos`
 * 例如 `/file-structure/[[...slug]]` -> `/file-structure`
 */
function staticPrefix(path: string) {
    const segments = splitPath(path);
    const staticSegments: string[] = [];
    for (const segment of segments) {
        if (isDynamicSegment(segment)) break;
        staticSegments.push(segment);
    }
    return `/${staticSegments.join('/')}`.replace(/\/+/g, '/');
}

/**
 * 递归收集菜单配置中的全部 URL（包含子菜单）。
 */
function collectUrls(items: RouteItem[], acc: string[] = []) {
    for (const item of items) {
        acc.push(normalizePath(item.url));
        if (item.items?.length) {
            collectUrls(item.items, acc);
        }
    }
    return acc;
}

/**
 * 校验菜单配置是否与真实页面路由一致：
 * - 静态路由：要求精确存在于 `APP_PAGE_ROUTES`
 * - 动态路由：要求其静态前缀能匹配至少一个真实页面路由
 */
export function validateRouteMenuConfig(
    menuItems: RouteItem[] = ROUTE_MENU_CONFIG,
): RouteValidationResult {
    const pagePaths = new Set(APP_PAGE_ROUTES.map((route) => normalizePath(route.path)));
    const invalidUrls: string[] = [];
    const urls = collectUrls(menuItems);

    for (const url of urls) {
        if (!hasDynamicSegment(url)) {
            if (!pagePaths.has(url)) invalidUrls.push(url);
            continue;
        }

        const prefix = staticPrefix(url);
        const matched = Array.from(pagePaths).some(
            (pagePath) => pagePath === prefix || pagePath.startsWith(`${prefix}/`),
        );
        if (!matched) invalidUrls.push(url);
    }

    return {
        valid: invalidUrls.length === 0,
        invalidUrls,
    };
}

export const ROUTE_LIST = ROUTE_MENU_CONFIG;
export const ROUTE_MENU_VALIDATION = validateRouteMenuConfig();
