import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const appDir = path.join(projectRoot, 'app');
const outputFile = path.join(projectRoot, 'lib', 'routes.tsx');

const PAGE_FILE_RE = /^page\.(tsx|ts|jsx|js)$/;
const API_FILE_RE = /^route\.(tsx|ts|jsx|js)$/;

function toPosix(value) {
    return value.split(path.sep).join('/');
}

function cleanSegment(segment) {
    if (!segment) return '';
    if (segment === '.') return '';
    if (segment.startsWith('(') && segment.endsWith(')')) return '';
    if (segment.startsWith('@')) return '';
    return segment.replace(/^\((?:\.\.\.|\.{1,2})\)/, '');
}

function fileToRoute(relativeDir) {
    const rawSegments = toPosix(relativeDir)
        .split('/')
        .filter(Boolean)
        .map(cleanSegment)
        .filter(Boolean);
    const route = `/${rawSegments.join('/')}`.replace(/\/+/g, '/');
    return route === '/' ? '/' : route.replace(/\/$/, '') || '/';
}

async function walk(dir, acc = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await walk(fullPath, acc);
            continue;
        }
        acc.push(fullPath);
    }
    return acc;
}

function serializeArray(name, routes) {
    const lines = routes.map(
        (route) =>
            `    { path: '${route.path}', file: '${route.file}', kind: '${route.kind}' as const },`,
    );
    return `export const ${name} = [\n${lines.join('\n')}\n] as const;\n`;
}

async function main() {
    const files = await walk(appDir);
    const pages = [];
    const apis = [];

    for (const file of files) {
        const base = path.basename(file);
        const relativeFile = toPosix(path.relative(projectRoot, file));
        const relativeDir = path.dirname(path.relative(appDir, file));
        const rawSegments = toPosix(relativeDir).split('/').filter(Boolean);
        const routePath = fileToRoute(relativeDir);

        if (PAGE_FILE_RE.test(base)) {
            const isParallelSlot = rawSegments.some((segment) => segment.startsWith('@'));
            const isInterceptedRoute = rawSegments.some((segment) =>
                /^\((?:\.\.\.|\.{1,2})\)/.test(segment),
            );
            if (isParallelSlot || isInterceptedRoute) continue;

            pages.push({
                path: routePath,
                file: relativeFile,
                kind: 'page',
            });
            continue;
        }

        if (API_FILE_RE.test(base)) {
            apis.push({
                path: routePath,
                file: relativeFile,
                kind: 'api',
            });
        }
    }

    pages.sort((a, b) => a.path.localeCompare(b.path) || a.file.localeCompare(b.file));
    apis.sort((a, b) => a.path.localeCompare(b.path) || a.file.localeCompare(b.file));

    const fileContent = `/* eslint-disable */
// AUTO-GENERATED FILE. DO NOT EDIT.
// Run: pnpm routes:gen

export type GeneratedRoute = {
    path: string;
    file: string;
    kind: 'page' | 'api';
};

${serializeArray('APP_PAGE_ROUTES', pages)}
${serializeArray('APP_API_ROUTES', apis)}
export const APP_ROUTES: readonly GeneratedRoute[] = [
    ...APP_PAGE_ROUTES,
    ...APP_API_ROUTES,
];
`;

    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await fs.writeFile(outputFile, fileContent, 'utf8');

    console.log(
        `Generated ${toPosix(path.relative(projectRoot, outputFile))} (pages=${pages.length}, api=${apis.length})`,
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
