import { NextResponse } from 'next/server';
import { parseCookies } from 'nookies';

export function middleware(req: any) {
  const cookies = parseCookies({ req });
  const authToken = cookies.auth_token;
  console.log("RUN INTO THIS FILE")
  // If no token found, redirect to login page
  if (!authToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next(); // Allow request to continue if authenticated
}

export const config = {
  matcher: ['/dashboard'],
};
