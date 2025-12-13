import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const publicRoutes = ["/", "/login", "/signup"];
const authRoutes = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const pathname = request.nextUrl.pathname;
  const isPrivateRoute = !publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  // ログイン済みユーザーが認証ページにアクセスした場合はadminにリダイレクト
  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!sessionCookie && isPrivateRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - llms.txt (LLM documentation file)
     * - images and other static assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|llms.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
