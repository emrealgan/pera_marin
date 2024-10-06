import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const pathname = req.nextUrl.pathname;

  const isAdminRoute = pathname.startsWith("/admin");

  const isLoginRoute = pathname.startsWith("/login");

  if (isAdminRoute) {
    if (!token || token.role !== "admin") {
      if (!isLoginRoute) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  }

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/login"],
};
