'use client';

import { LanguagesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserMenu } from '@/components/layout/user-menu';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export function AppHeader({ email }: { email?: string | null }) {
  const router = useRouter();
  const handleLogout = () =>
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/auth/login');
        },
      },
    });

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <span className="text-sm font-semibold">
            Internal Accounting – PT Agrinas
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <LanguagesIcon className="size-4" />
          </Button>

          <UserMenu
            email={email}
            onLogout={handleLogout}
            trigger={
              <Button variant="ghost" size="icon">
                <Avatar className="size-8 rounded-md">
                  <AvatarFallback>
                    {email?.[0]?.toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
        </div>
      </div>
    </header>
  );
}
