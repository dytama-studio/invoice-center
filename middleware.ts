import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "@/lib/auth";

const publicPaths = ["/auth/login", "/api/auth"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = getSessionCookie(request, {
    cookieName: "agrinas_session"
  });

  const headers = new Headers(request.headers);
  headers.set("x-pathname", pathname);

  if (!session && !publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (session && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
