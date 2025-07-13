import { NextFetchEvent, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { ROUTES } from '@/contants/routes';

const AUTH_PAGES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.RESET,
  ROUTES.VERIFY,
];

export default async function middleware(req: NextRequestWithAuth, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  if (AUTH_PAGES.some((page) => pathname === page || pathname.startsWith(page + '/'))) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = ROUTES.ADMIN;
      url.search = '';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  return withAuth({
    pages: {
      signIn: ROUTES.LOGIN,
    },
  })(req, event);
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/reset-password',
    '/verify',
    '/reset-password/(.*)',
    '/verify/(.*)',
    '/admin/:path*'
  ],
};
