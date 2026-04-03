import { NextResponse } from 'next/server';
import { ENV } from '@/lib/env';

/**
 * 退出登录，清理浏览器侧 cookie
 */
export async function POST() {
    // JWT 模式：退出只需清理浏览器侧 cookie。
    const response = NextResponse.json({
        code: 200,
        msg: '退出成功',
    });

    response.cookies.set(ENV.TOKEN_COOKIE_NAME, '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: ENV.IS_PRODUCTION,
        path: '/',
        maxAge: 0,
    });

    return response;
}
