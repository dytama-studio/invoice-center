import { UserMenu } from "@/components/layout/user-menu";

export function Topbar({ email }: { email?: string | null }) {
  return (
    <header className="flex items-center justify-between border-b bg-sheet px-4 py-3">
      <div className="text-sm font-semibold">Internal Accounting & Invoicing</div>
      <UserMenu email={email} />
    </header>
  );
}
