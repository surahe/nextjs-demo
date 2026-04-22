import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ENV } from '@/lib/env';
import { SERVER_ENV } from '@/lib/env.server';
import { MOCK_AUTH_USER, buildMockUserInfo } from '@/mocks/auth';

const DEFAULT_EXPIRES_IN = 60 * 60 * 24;

/**
 * 将 JWT 过期配置解析为秒数，用于 cookie maxAge。
 */
function parseJwtExpiresInToSeconds(expiresIn: string | undefined) {
    // 未配置时回退到默认 1 天
    if (!expiresIn) return DEFAULT_EXPIRES_IN;
    const raw = expiresIn.trim();

    // 纯数字按“秒”处理（例如 "3600"）
    const pureNumber = Number(raw);
    if (Number.isFinite(pureNumber) && pureNumber > 0) {
        return Math.floor(pureNumber);
    }

    // 支持简写格式：s/m/h/d（例如 "15m"、"7d"）
    const match = /^(\d+)([smhd])$/.exec(raw);
    if (!match) return DEFAULT_EXPIRES_IN;

    const amount = Number(match[1]);
    const unit = match[2];
    const scaleMap: Record<string, number> = {
        s: 1,
        m: 60,
        h: 60 * 60,
        d: 60 * 60 * 24,
    };

    return amount * scaleMap[unit];
}

/**
 * 登录接口（mock 账号）：校验用户名密码 -> 签发 JWT -> 写入 httpOnly cookie。
 */
export async function POST(request: NextRequest) {
    try {
        // 1) 读取并清洗请求体参数
        const body = await request.json();
        const username = typeof body?.username === 'string' ? body.username.trim() : '';
        const password = typeof body?.password === 'string' ? body.password : '';

        // 2) 基础参数校验
        if (!username || !password) {
            return NextResponse.json({ code: 400, msg: '用户名和密码不能为空' }, { status: 400 });
        }

        // 3) mock 账号校验
        if (username !== MOCK_AUTH_USER.username || password !== MOCK_AUTH_USER.password) {
            return NextResponse.json({ code: 401, msg: '用户名或密码错误' }, { status: 401 });
        }

        const secret = SERVER_ENV.JWT_SECRET;
        if (!secret) {
            return NextResponse.json(
                { code: 500, msg: '服务器未配置 JWT_SECRET' },
                { status: 500 },
            );
        }

        // 4) 读取过期配置原值（可能是 "3600" 或 "1d" 这类字符串）
        const expiresIn = SERVER_ENV.JWT_EXPIRES_IN;
        // 供 cookie 使用：cookie 的 maxAge 必须是秒数
        const expiresInSeconds = parseJwtExpiresInToSeconds(expiresIn);
        // 供 jwt.sign 使用：数字字符串转 number，其余保持如 "1d"/"15m" 这类格式。
        // 这样既兼容 jsonwebtoken 的 expiresIn 类型，也避免把 "3600" 当成无效字符串。
        const signExpiresIn: jwt.SignOptions['expiresIn'] = /^\d+$/.test(expiresIn)
            ? Number(expiresIn)
            : (expiresIn as jwt.SignOptions['expiresIn']);
        // 使用 HS256 签发 JWT，后续由 getUserFromToken 统一校验。
        const token = jwt.sign(
            {
                userId: MOCK_AUTH_USER.id,
                username: MOCK_AUTH_USER.username,
            },
            secret,
            {
                expiresIn: signExpiresIn,
            },
        );

        // 5) 组装返回用户信息（不含敏感字段）
        const userInfo = buildMockUserInfo();

        const response = NextResponse.json({
            code: 200,
            msg: '登录成功',
            data: {
                token,
                userInfo: {
                    id: userInfo.id,
                    username: userInfo.username,
                    nickname: userInfo.nickname,
                },
            },
        });

        // 将 token 放入 httpOnly cookie，前端 JS 无法直接读取，安全性更高。
        response.cookies.set(ENV.TOKEN_COOKIE_NAME, token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: ENV.IS_PRODUCTION,
            path: '/',
            maxAge: expiresInSeconds,
        });

        return response;
    } catch {
        return NextResponse.json({ code: 500, msg: '服务器错误' }, { status: 500 });
    }
}
