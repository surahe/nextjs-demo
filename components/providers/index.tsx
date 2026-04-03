// components/providers/index.tsx
// 全局 Provider 组合，在 app/layout.tsx 的根层包裹整棵 React 树
'use client';

import { Toaster } from 'sonner';
import { NuqsAdapter } from 'nuqs/adapters/next';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NuqsAdapter>
            <TooltipProvider>
                {children}
                <Toaster position="top-right" richColors closeButton duration={3000} />
            </TooltipProvider>
        </NuqsAdapter>
    );
}
