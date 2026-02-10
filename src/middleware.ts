import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Session } from './lib/auth';

export async function middleware(req: NextRequest) {
  const res = await fetch(
    `${process.env.BETTER_AUTH_URL || req.nextUrl.origin}/api/auth/get-session`,
    {
      headers: {
        cookie: req.headers.get('cookie') ?? '',
      },
    },
  );

  const session: Session | null = await res.json();

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
