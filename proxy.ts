import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { HEADERS } from './lib/constants';
import { ENV } from './lib/env';

// 定义需要登录才能访问的路由前缀
const protectedRoutes = ['/profile', '/settings'];
// 定义不需要登录才能访问的路由（如果用户已登录，访问这些页面会重定向到首页）
const publicRoutes = ['/login', '/register'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 运维要求健康探测接口路径为/health，但nextjs默认是/api/health，所以需要重定向到/api/health
    if (pathname.startsWith('/health')) {
        return NextResponse.redirect(new URL('/api/health', request.url));
    }

    // 获取登录凭证
    const token = request.cookies.get(ENV.TOKEN_COOKIE_NAME)?.value;

    // 检查是否是受保护的路由
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.includes(pathname);

    // 拦截逻辑：未登录用户访问受保护页面 -> 重定向到登录页
    if (isProtectedRoute && !token) {
        // 创建一个重定向 URL，并带上原本想访问的地址作为 callback_url
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callback_url', pathname);

        return NextResponse.redirect(loginUrl);
    }

    // 拦截逻辑：已登录用户访问登录页 -> 重定向到首页
    if (isPublicRoute && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 注入当前路径到请求头，供下游的 Server Component 或 Route Handlers 读取
    // 例如在 Server Component 中可以通过 headers().get(HEADERS.CURRENT_PATH) 获取
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(HEADERS.CURRENT_PATH, pathname);

    // 将修改后的 Request Headers 传递给下游
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    // 如果需要设置新的 Cookie 发给浏览器，可以在 response 上操作
    // response.cookies.set('visited', 'true');

    return response;
}

// 配置 Matcher：只拦截需要的路径，极大提升性能！
export const proxyConfig = {
    matcher: [
        /*
         * 匹配所有的请求路径，但是排除以下几种：
         * - api (API 路由)
         * - _next/static (静态文件)
         * - _next/image (图片优化文件)
         * - favicon.ico (浏览器图标)
         * - public 文件夹下的任何文件 (例如 .svg, .png 等)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
