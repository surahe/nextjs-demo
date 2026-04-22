// components/providers/index.tsx
// 全局 Provider 组合，在 app/layout.tsx 的根层包裹整棵 React 树
'use client';

import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { NuqsAdapter } from 'nuqs/adapters/next';
import { TooltipProvider } from '@/components/ui/tooltip';
import { markNotifyReady } from '@/lib/notify';

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // 确保 Toaster 挂载后，再标记为已准备
        // 避免首条 toast 丢失
        // @ts-ignore
        markNotifyReady();
    }, []);

    return (
        <NuqsAdapter>
            <TooltipProvider>
                {children}
                <Toaster position="top-center" richColors closeButton duration={3000} />
            </TooltipProvider>
        </NuqsAdapter>
    );
}
