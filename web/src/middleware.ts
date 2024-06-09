import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

import davsClient from './common/clients/davs-client';

export async function middleware(request: NextRequest) {
  if (['/login', '/sign-up'].includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const cookieStore = cookies();
  const davsSessions = cookieStore.get('davs_session');
  if (davsSessions == null) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const sessionResponse = await davsClient.users.session({
    jwt: davsSessions.value,
  });
  if (!sessionResponse.ok) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const sessionJSONResponse = await sessionResponse.text();
  const response = NextResponse.next();
  response.headers.set('session', sessionJSONResponse);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
