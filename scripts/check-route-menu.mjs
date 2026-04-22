import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const routesFile = path.join(projectRoot, 'lib', 'routes.tsx');
const routeMenuConfigFile = path.join(projectRoot, 'lib', 'route-menu.config.ts');

function normalizePath(value) {
    if (!value) return '/';
    const normalized = value.trim().replace(/\/+/g, '/').replace(/\/$/, '');
    return normalized || '/';
}

function splitPath(pathname) {
    return normalizePath(pathname).split('/').filter(Boolean);
}

function isDynamicSegment(segment) {
    return segment.startsWith(':') || /^\[.*\]$/.test(segment);
}

function hasDynamicSegment(pathname) {
    return splitPath(pathname).some(isDynamicSegment);
}

function staticPrefix(pathname) {
    const segments = splitPath(pathname);
    const staticSegments = [];
    for (const segment of segments) {
        if (isDynamicSegment(segment)) break;
        staticSegments.push(segment);
    }
    return `/${staticSegments.join('/')}`.replace(/\/+/g, '/');
}

function extractPagePaths(routesSource) {
    const match = routesSource.match(
        /export const APP_PAGE_ROUTES = \[(?<content>[\s\S]*?)\] as const;/,
    );
    if (!match?.groups?.content) return [];

    const paths = [];
    const pathRe = /path:\s*'([^']+)'/g;
    for (const pathMatch of match.groups.content.matchAll(pathRe)) {
        paths.push(normalizePath(pathMatch[1]));
    }
    return paths;
}

function extractMenuUrls(configSource) {
    const urls = [];
    const urlRe = /url:\s*'([^']+)'/g;
    for (const match of configSource.matchAll(urlRe)) {
        urls.push(normalizePath(match[1]));
    }
    return urls;
}

function validateUrls(menuUrls, pagePaths) {
    const pagePathSet = new Set(pagePaths);
    const invalid = [];

    for (const url of menuUrls) {
        if (url.startsWith('http://') || url.startsWith('https://')) continue;

        if (!hasDynamicSegment(url)) {
            if (!pagePathSet.has(url)) invalid.push(url);
            continue;
        }

        const prefix = staticPrefix(url);
        const matched = pagePaths.some(
            (pagePath) => pagePath === prefix || pagePath.startsWith(`${prefix}/`),
        );
        if (!matched) invalid.push(url);
    }

    return Array.from(new Set(invalid));
}

async function main() {
    const [routesSource, routeMenuConfigSource] = await Promise.all([
        fs.readFile(routesFile, 'utf8'),
        fs.readFile(routeMenuConfigFile, 'utf8'),
    ]);

    const pagePaths = extractPagePaths(routesSource);
    const menuUrls = extractMenuUrls(routeMenuConfigSource);
    const invalidUrls = validateUrls(menuUrls, pagePaths);

    if (invalidUrls.length > 0) {
        console.error('Route menu validation failed.');
        console.error('Invalid URLs (not found in APP_PAGE_ROUTES):');
        for (const url of invalidUrls) {
            console.error(`  - ${url}`);
        }
        process.exitCode = 1;
        return;
    }

    console.log(
        `Route menu validation passed. Checked ${menuUrls.length} configured URLs against ${pagePaths.length} pages.`,
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
