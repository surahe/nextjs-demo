import { NextResponse, NextRequest } from 'next/server';

// 如果在内部使用 `await`，此函数可以标记为 `async`
export function proxy(request: NextRequest) {
    return NextResponse.redirect(new URL('/home', request.url));
}

export const config = {
    matcher: '/about/:path*',
};
