import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("auth_user");

    // Allow login page only (access check is done client-side via sessionStorage)
    if (request.nextUrl.pathname === "/admin/login") {
      // If already authenticated, redirect to dashboard
      if (authCookie) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // For all other admin routes, check authentication
    if (!authCookie) {
      // Redirect to home page (not login page, to keep it secret)
      const response = NextResponse.redirect(new URL("/", request.url));
      // Add a custom header to detect unauthorized access attempts
      response.headers.set("X-Redirect-Reason", "unauthorized");
      return response;
    }

    // User is authenticated, allow access
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: "/admin/:path*",
};
