import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { ENV } from '@/lib/env';
import { getUserFromToken } from '@/lib/auth';
import type { GetInfoData } from '@/types/auth';

/**
 * 获取用户信息，通过 JWT 解析用户信息
 * @returns 用户信息
 */
export async function GET() {
    const store = await cookies();
    const token = store.get(ENV.TOKEN_COOKIE_NAME)?.value;
    // 与 layout 共用同一鉴权解析函数，保证规则一致。
    const user = getUserFromToken(token);
    if (!user) return NextResponse.json<{ data: GetInfoData | null }>({ data: null });
    return NextResponse.json<{ data: GetInfoData }>({ data: { user } });
}
