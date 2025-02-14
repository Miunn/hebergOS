import createMiddleware from 'next-intl/middleware';
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { routing } from './i18n/routing';
import { Role } from '@prisma/client';

async function customMiddleware(request: NextRequestWithAuth) {
    const handleI18nRouting = createMiddleware(routing);

    const pathname = request.nextUrl.pathname;
    const locale = getLocaleFromUrl(request.nextUrl);

    if (RegExp(`^/(${routing.locales.join('|')})/login$`).test(pathname) && request.nextUrl.searchParams.get("callbackUrl") === null) {
        const defaultLoginUrl = new URL(`/${locale}/login?callbackUrl=${process.env.NEXTAUTH_URL}/${locale}/app${request.nextUrl.search.replace("?", "&")}`, request.url);
        return NextResponse.redirect(defaultLoginUrl);
    }

    if (RegExp(`^/(${routing.locales.join('|')})/login$`).test(pathname) && request.nextauth.token) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/${locale}/app`);
    }

    const response = handleI18nRouting(request);

    response.headers.set('X-Current-Path', pathname);

    return response;
}

export default withAuth(customMiddleware, {
    callbacks: {
        async authorized({ token, req }) {
            const isLoggedIn = !!token;
            const isOnApp = new RegExp(`(${routing.locales.join('|')})/app`).test(req.nextUrl.pathname);
            const isOnAdminPage = new RegExp(`(${routing.locales.join('|')})/app/administration`).test(req.nextUrl.pathname);

            if (isOnAdminPage) {
                if (isLoggedIn && token.roles.includes(Role.ADMIN)) return true;
                return false; // Redirect unauthorized users to home page
            }

            if (isOnApp) {
                if (!isLoggedIn) return false;
                return true; // Redirect unauthenticated users to login page
            }
            return true;
        },
    },
});

function getLocaleFromUrl(url: URL) {
    const locale = url.pathname.split('/')[1];
    return routing.locales.includes(locale as "en" | "fr") ? locale : routing.defaultLocale;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    ]
}

