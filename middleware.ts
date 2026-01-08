import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware لحماية Admin Routes
 * يتحقق من تسجيل الدخول قبل الوصول إلى /admin/*
 */
export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  // تجاهل API routes (لها حماية منفصلة)
  if (isApiRoute) {
    return NextResponse.next();
  }

  // إذا كان في Admin route لكن ليس في login page
  if (isAdminRoute && !isLoginPage) {
    // إذا لم يكن مسجل دخول → توجيه إلى login
    if (!session || session.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // إذا كان في login page ومسجل دخول → توجيه إلى dashboard
  if (isLoginPage && session?.value === 'authenticated') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    // استثناء static files و API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
