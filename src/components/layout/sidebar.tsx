import Link from "next/link";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/home", label: "Dashboard" },
  { href: "/master/regions", label: "Master Data" },
  { href: "/contracts", label: "Contracts" },
  { href: "/proforma", label: "Proforma" },
  { href: "/invoices", label: "Invoices" },
  { href: "/payments", label: "Payments" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" }
];

export function Sidebar({ activePath }: { activePath?: string }) {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-sheet">
      <div className="border-b px-4 py-4 text-sm font-semibold">PT Agrinas Finance</div>
      <nav className="flex-1 space-y-1 p-2">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-md px-3 py-2 text-sm",
              activePath?.startsWith(item.href) ? "bg-line/40 font-semibold" : "hover:bg-line/30"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
