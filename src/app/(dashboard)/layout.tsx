import { headers } from "next/headers";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getServerSession } from "@/server/auth/getServerSession";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  const pathname = headers().get("x-pathname") ?? "/home";

  return (
    <div className="flex">
      <Sidebar activePath={pathname} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar email={session?.user?.email ?? null} />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
