'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ROUTE_LIST } from '@/lib/route-menu';
import type { RouteItem } from '@/types/routes';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

function normalizePath(path: string) {
    if (!path) return '/';
    const normalized = path.trim().replace(/\/+/g, '/').replace(/\/$/, '');
    return normalized || '/';
}

function splitPath(path: string) {
    return normalizePath(path).split('/').filter(Boolean);
}

function escapeRegExp(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 识别动态路由片段：同时支持配置风格和 Next.js 文件路由风格。
// 支持示例：
// - /photos/:id
// - /photos/:id?
// - /photos/[id]
// - /docs/[...slug]
// - /docs/[[...slug]]
function isDynamicPattern(url: string) {
    return /:[\w]+\??|\[\[?\.\.\.[^\]]+\]\]?|\[[^\]]+\]/.test(url);
}

// 把路由模式转换为用于匹配 pathname 的正则。
// 按“分段”构建，避免整串替换带来的误伤，也便于逐类理解动态语法。
function patternToRegex(pattern: string) {
    const segments = splitPath(pattern);
    if (segments.length === 0) return /^\/$/;

    let source = '^';
    for (const segment of segments) {
        // ":id?" -> 可选单段，例如 "/photos" 或 "/photos/123"
        if (/^:[^/?]+\?$/.test(segment)) {
            source += '(?:\\/[^/]+)?';
            continue;
        }
        // ":id" -> 必填单段，例如 "/photos/123"
        if (/^:[^/?]+$/.test(segment)) {
            source += '\\/[^/]+';
            continue;
        }
        // "[[...slug]]" -> 可选 catch-all，允许 0~多段
        // 可匹配 "/docs"、"/docs/a"、"/docs/a/b"
        if (/^\[\[\.\.\.[^\]]+\]\]$/.test(segment)) {
            source += '(?:\\/[^/]+(?:\\/[^/]+)*)?';
            continue;
        }
        // "[...slug]" -> 必填 catch-all，至少 1 段
        // 可匹配 "/docs/a"、"/docs/a/b"
        if (/^\[\.\.\.[^\]]+\]$/.test(segment)) {
            source += '\\/[^/]+(?:\\/[^/]+)*';
            continue;
        }
        // "[id]" -> 必填单段
        if (/^\[[^\]]+\]$/.test(segment)) {
            source += '\\/[^/]+';
            continue;
        }
        // 静态片段：转义正则特殊字符，避免被当作元字符。
        source += `\\/${escapeRegExp(segment)}`;
    }

    // 兼容尾斜杠："/a/b" 与 "/a/b/" 都能匹配。
    source += '\\/?$';
    return new RegExp(source);
}

// 模块级缓存：
// 菜单配置在运行期通常是静态的，因此缓存 pathname -> 面包屑结果是安全的，
// 可以减少重复树遍历。
const breadcrumbCache = new Map<string, RouteItem[]>();

function findBreadcrumbs(
    items: RouteItem[],
    pathname: string,
    trail: RouteItem[] = [],
): RouteItem[] | null {
    for (const item of items) {
        const current = [...trail, item];
        const itemUrl = normalizePath(item.url);
        const isExact = itemUrl === pathname;
        const isPattern =
            !isExact && isDynamicPattern(itemUrl) && patternToRegex(itemUrl).test(pathname);

        if (isExact || isPattern) {
            return current;
        }

        if (item.items?.length) {
            const found = findBreadcrumbs(item.items, pathname, current);
            if (found) return found;
        }
    }

    return null;
}

function getBreadcrumbs(pathname: string): RouteItem[] {
    if (breadcrumbCache.has(pathname)) {
        return breadcrumbCache.get(pathname) ?? [];
    }

    const result = findBreadcrumbs(ROUTE_LIST, pathname) ?? [];
    breadcrumbCache.set(pathname, result);
    return result;
}

export default function RouteBreadcrumb() {
    const pathname = normalizePath(usePathname());
    const breadcrumbs = getBreadcrumbs(pathname);

    // 当前路径不在菜单配置中时，不渲染面包屑。
    if (breadcrumbs.length === 0) return null;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    const itemUrl = normalizePath(item.url);

                    return (
                        <React.Fragment key={`${itemUrl}-${index}`}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                ) : isDynamicPattern(itemUrl) ? (
                                    item.title
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={itemUrl}>{item.title}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
