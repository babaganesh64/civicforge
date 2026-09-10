import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  // Authentication is enforced by the authenticated layout because access tokens
  // are stored client-side. Keep the public landing page accessible for the SIH demo.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
