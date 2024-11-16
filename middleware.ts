import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/uploadthing', '/welcome']);

export default clerkMiddleware((auth, req) => {
  const { nextUrl } = req;

  if (nextUrl.pathname === '/') {
    if (!auth().userId) {
      return NextResponse.redirect(new URL('/welcome', nextUrl.origin));
    }
  }

  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
