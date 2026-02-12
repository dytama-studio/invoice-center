'use client';

import * as React from 'react';
import { GalleryVerticalEnd } from 'lucide-react';

import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const result = await authClient.signIn.email({
      email,
      password,
    });

    if (result?.error) {
      const message = result.error.message ?? 'Invalid credentials';
      setError(message);
      toast({
        title: 'Login failed',
        description: message,
        variant: 'error',
      });
      setLoading(false);
      return;
    }

    toast({ title: 'Login success', variant: 'success' });
    window.location.href = '/home';
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            AGRINAS Finance
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <form
            className="flex w-full max-w-xs flex-col gap-6"
            onSubmit={onSubmit}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Login to your account</h1>
              <p className="text-balance text-sm text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {error ? (
                <div className="text-sm text-destructive">{error}</div>
              ) : null}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="relative hidden lg:block min-h-screen overflow-hidden bg-gradient-to-t from-orange-300 via-orange-400 to-orange-600">
        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
            linear-gradient(45deg, transparent 49%, white 49%, white 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, white 49%, white 51%, transparent 51%)
          `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex w-full h-screen justify-center items-center">
          <div className="flex flex-col space-y-4 text-white">
            <h1 className="text-xl lg:text-6xl font-semibold">Hey, Hello</h1>
            <p className="text-lg font-normal">
              Welcome to Agrinas Finance App
            </p>
            <p className="text-sm font-normal max-w-md">
              We provide all advantage that can simplify all your financial
              transaction without any further requirements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
