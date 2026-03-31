'use client';

import { useActionState, useState } from 'react';
import type { FormInitData, SubmitFormInput } from '../mock';
import { submitForm } from '../mock';
import { serverSubmitAction, type ServerSubmitState } from '../actions';

export default function FormClient({ initial }: { initial: FormInitData }) {
    const [username, setUsername] = useState(initial.username);
    const [gender, setGender] = useState<SubmitFormInput['gender']>(initial.gender);
    const [pending, setPending] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [serverState, formAction, serverPending] = useActionState<ServerSubmitState, FormData>(
        serverSubmitAction,
        {},
    );

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setPending(true);
        setResult(null);
        try {
            const res = await submitForm({ username, gender });
            setResult(`${res.message} · ${res.submittedAt}`);
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="space-y-4">
            <div className="text-sm text-zinc-600">初始化信息：{initial.serverNote}</div>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm">用户名</label>
                    <input
                        className="w-full rounded border px-3 py-2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="请输入用户名"
                        name="username"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm">性别</label>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={gender === 'female'}
                                onChange={() => setGender('female')}
                            />
                            <span>女</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={gender === 'male'}
                                onChange={() => setGender('male')}
                            />
                            <span>男</span>
                        </label>
                    </div>
                </div>
                <button
                    disabled={pending}
                    className={`rounded px-4 py-2 text-white ${pending ? 'bg-zinc-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                    {pending ? '提交中…' : '提交'}
                </button>
                {result ? <div className="text-emerald-700">{result}</div> : null}
            </form>

            <div className="border-t pt-4">
                <div className="mb-2 text-sm">通过 Server Action 提交</div>
                <form action={formAction} className="flex items-end gap-4">
                    <div>
                        <label className="mb-1 block text-sm">用户名</label>
                        <input
                            name="username"
                            defaultValue={initial.username}
                            className="rounded border px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm">性别</label>
                        <select
                            name="gender"
                            defaultValue={initial.gender}
                            className="rounded border px-3 py-2"
                        >
                            <option value="female">女</option>
                            <option value="male">男</option>
                        </select>
                    </div>
                    <button
                        disabled={serverPending}
                        className={`rounded px-4 py-2 text-white ${serverPending ? 'bg-zinc-400' : 'bg-sky-600 hover:bg-sky-700'}`}
                    >
                        {serverPending ? '提交中…' : '服务端提交'}
                    </button>
                </form>
                {serverState?.message ? (
                    <div className="mt-2 text-sky-700">{serverState.message}</div>
                ) : null}
            </div>
        </div>
    );
}
