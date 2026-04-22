import { createSearchParamsCache, parseAsInteger, parseAsString } from 'nuqs/server';

/**
 * 统一维护 nuqs 参数描述：
 * - 供 Client hooks（useQueryState/useQueryStates）复用
 * - 供 Server cache（createSearchParamsCache）复用
 */
export const nuqsParsers = {
    page: parseAsInteger.withDefault(1),
    keyword: parseAsString.withDefault(''),
};

export type NuqsInitialState = {
    page: number;
    keyword: string;
};

/**
 * Server Component 中的 searchParams 缓存。
 * 需要在页面入口先执行 parse(...)，后续子级 Server Component 才能 get/all。
 */
export const searchParamsCache = createSearchParamsCache(nuqsParsers);
