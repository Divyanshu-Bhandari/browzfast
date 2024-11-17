import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/uploadthing', '/']);

export default clerkMiddleware((auth, req) => {
  const { nextUrl } = req;
  const { userId } = auth();

  // If the user is not authenticated and tries to access `/`, allow access to the welcome page
  if (nextUrl.pathname === '/') {
    if (!userId) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/home', nextUrl.origin));
    }
  }

  // For non-public routes, if the user is not authenticated, redirect them to `/`
  if (!isPublicRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL('/', nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
