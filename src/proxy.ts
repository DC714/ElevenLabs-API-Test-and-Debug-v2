import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "./lib/auth";

const intlMiddleware = createMiddleware(routing);

const PUBLIC_PATHS = ["/login", "/register"];

export default async function proxy(request: NextRequest) {
  const intlResponse = intlMiddleware(request);

  // next-intl already decided to redirect (e.g. bare "/" -> "/{defaultLocale}") - let that happen
  // first; the auth check runs on the next request, once the locale-prefixed URL is settled.
  if (intlResponse.headers.get("location")) {
    return intlResponse;
  }

  const pathname = request.nextUrl.pathname;
  const matchedLocale = routing.locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  const locale = matchedLocale ?? routing.defaultLocale;
  const pathWithoutLocale = matchedLocale ? pathname.slice(`/${matchedLocale}`.length) || "/" : pathname;
  const isPublicPath = PUBLIC_PATHS.includes(pathWithoutLocale);

  const session = await auth.api.getSession({ headers: request.headers });

  if (isPublicPath && session) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
