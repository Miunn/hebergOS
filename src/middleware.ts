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
            const isLoggedIn = !!token?.user;
            const isOnApp = req.nextUrl.pathname.startsWith('/app');
            if (isOnApp) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return true;
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

