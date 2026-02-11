'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { ChevronRight } from 'lucide-react';
import { sidebarNav } from './sidebar-data';
import { cn } from '@/lib/utils';

export function SidebarNav() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    sidebarNav.forEach((item) => {
      if (item.isChild && item.child.some((c) => pathname.startsWith(c.href))) {
        setOpenMenu(item.label);
      }
    });
  }, [pathname]);

  return (
    <SidebarMenu>
      {sidebarNav.map((item) => {
        const isChild = item.isChild;
        const isOpen = openMenu === item.label;
        const isActive =
          item.href && pathname === item.href
            ? true
            : isChild && item.child.some((c) => pathname.startsWith(c.href));

        return (
          <SidebarMenuItem key={item.label}>
            {/* ===== Parent ===== */}
            {isChild ? (
              <SidebarMenuButton
                isActive={isActive}
                onClick={() => setOpenMenu(isOpen ? null : item.label)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {item.icon && <item.icon className="size-4" />}
                  <span>{item.label}</span>
                </div>

                {/* Chevron */}
                <ChevronRight
                  className={cn(
                    'size-4 transition-transform duration-200',
                    isOpen && 'rotate-90',
                  )}
                />
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton asChild isActive={isActive}>
                <Link href={item.href!}>
                  {item.icon && <item.icon className="size-4" />}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            )}

            {/* ===== Sub Menu ===== */}
            {isChild && (
              <SidebarMenuSub
                className={cn(
                  'ml-6 overflow-hidden border-l pl-2 transition-all duration-300',
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
                )}
              >
                {item.child.map((child) => {
                  const isChildActive = pathname.startsWith(child.href);

                  return (
                    <SidebarMenuSubItem key={child.href}>
                      <SidebarMenuSubButton asChild isActive={isChildActive}>
                        <Link href={child.href}>
                          <span>{child.label}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
