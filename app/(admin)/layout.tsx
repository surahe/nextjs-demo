// app/(admin)/layout.tsx
// Admin shell 布局：所有受保护的管理页面都使用此布局（侧边栏 + 顶栏 + 内容区）
import { cookies } from 'next/headers';

import { NavUser } from '@/components/sidebar/nav-user';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
// import RouteBreadcrumb from '@/components/route-breadcrumb';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AuthStoreInitializer } from '@/components/auth-store-initializer';

import { ENV } from '@/lib/env';
import { getUserFromToken } from '@/lib/auth';
import type { GetInfoData } from '@/types/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    let userInfoData: GetInfoData | null = null;
    const store = await cookies();
    const token = store.get(ENV.TOKEN_COOKIE_NAME)?.value;
    const user = getUserFromToken(token);
    if (user) userInfoData = { user };

    return (
        <>
            {userInfoData && <AuthStoreInitializer data={userInfoData} />}
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="bg-background border-sidebar-border sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            {/* <RouteBreadcrumb /> */}
                        </div>
                        <div className="ml-auto pr-4">
                            <NavUser />
                        </div>
                    </header>
                    <main className="flex flex-1 p-4 pt-0">{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
