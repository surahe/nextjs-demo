'use client';
// app/(admin)/dashboard/page.tsx
import { useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notify } from '@/lib/notify';

// 仪表盘首页占位
export default function DashboardPage() {
    useEffect(() => {
        notify.success('这是一条成功通知');
    }, []);

    return (
        <section className="flex w-full flex-col gap-4">
            <Card style={{ boxShadow: 'unset' }}>
                <CardHeader>
                    <CardTitle>模块A</CardTitle>
                </CardHeader>
                <CardContent>111</CardContent>
            </Card>
            <div className="flex gap-4">
                <Card className="min-w-163 flex-1">
                    <CardHeader>
                        <CardTitle>模块B</CardTitle>
                    </CardHeader>
                    <CardContent>222</CardContent>
                </Card>
                <Card className="relative h-70.5 w-100 shrink-0">
                    <CardHeader>
                        <CardTitle>模块C</CardTitle>
                    </CardHeader>
                    <CardContent>333</CardContent>
                </Card>
            </div>
        </section>
    );
}
