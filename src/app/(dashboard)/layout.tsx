import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
} from '@/components/ui/sidebar';
import NextTopLoader from 'nextjs-toploader';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { AppHeader } from '@/components/layout/topbar';
import { getServerSession } from '@/server/auth/getServerSession';
// import AppShell from '@/components/layout/apps-shell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    // <AppShell>{children}</AppShell>
    <div className="flex min-h-dvh w-full">
      <NextTopLoader color="#f97316" />
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <div className="border-b px-4 py-4 text-sm font-semibold">
              PT Agrinas Finance
            </div>
            <SidebarNav />
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-1 flex-col">
          <AppHeader email={session?.user?.email ?? null} />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
