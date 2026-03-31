'use server';

export type ServerSubmitState = {
    message?: string;
};

export async function serverSubmitAction(
    _prevState: ServerSubmitState,
    formData: FormData,
): Promise<ServerSubmitState> {
    await new Promise((r) => setTimeout(r, 800));
    const username = String(formData.get('username') ?? '');
    const gender = String(formData.get('gender') ?? '');
    const ts = new Date().toLocaleString();
    return {
        message: `服务端提交成功：${username} · ${gender} · ${ts}`,
    };
}
