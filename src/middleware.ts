import createMiddleware from 'next-intl/middleware';
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from './i18n/routing';

function customMiddleware(request: NextRequest) {
    const handleI18nRouting = createMiddleware(routing);
    return handleI18nRouting(request);
}

export default withAuth(customMiddleware, {
    callbacks: {
        async authorized({ token, req }) {
            const isLoggedIn = !!token;
            const isOnApp = new RegExp(`(${routing.locales.join('|')})/app`).test(req.nextUrl.pathname);
            const isOnAdminPage = new RegExp(`(${routing.locales.join('|')})/app/administration`).test(req.nextUrl.pathname);

            /**
             * TODO: Restrict access to containers pages based on user association
             */

            if (isOnAdminPage) {
                if (isLoggedIn && token.roles.includes('ADMIN')) return true;
                return false; // Redirect unauthorized users to home page
            }

            if (isOnApp) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
    },
});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    ]
}

