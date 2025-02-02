import createMiddleware from 'next-intl/middleware';
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { routing } from './i18n/routing';

async function customMiddleware(request: NextRequestWithAuth) {
    const handleI18nRouting = createMiddleware(routing);

    const pathname = request.nextUrl.pathname;
    const locale = getLocaleFromUrl(request.nextUrl);

    if (RegExp(`^/(${routing.locales.join('|')})/login$`).test(pathname) && request.nextUrl.searchParams.get("callbackUrl") === null) {
        const defaultLoginUrl = new URL(`/${locale}/login?callbackUrl=${process.env.NEXTAUTH_URL}/${locale}/app${request.nextUrl.search.replace("?", "&")}`, request.url);
        return NextResponse.redirect(defaultLoginUrl);
    }

    if (RegExp(`^/(${routing.locales.join('|')})/login$`).test(pathname) && request.nextauth.token) {
        if (request.nextUrl.searchParams.get("callbackUrl") === null) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/${locale}/app`);
        }

        if (RegExp(`^${process.env.NEXTAUTH_URL}/(${routing.locales.join('|')})/app/containers/(.*)$`).test(request.nextUrl.searchParams.get("callbackUrl")!)) {
            const match = request.nextUrl.searchParams.get("callbackUrl")!.match(RegExp(`^/(${routing.locales.join('|')})/app/containers/(.*)$`));
            if (!match) {
                return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/${locale}/app`);
            }
            const containerId = match[2];

            const isAllowed = await fetch(`${process.env.NEXTAUTH_URL}/api/users/check-container?containerId=${containerId.toString()}`, {
                method: 'POST',
                body: JSON.stringify({
                    user: request.nextauth.token.id
                })
            });

            if (!isAllowed.ok) {
                return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/${locale}/app`);
            }
        }

        return NextResponse.redirect(request.nextUrl.searchParams.get("callbackUrl")!);
    }

    return handleI18nRouting(request);
}

export default withAuth(customMiddleware, {
    callbacks: {
        async authorized({ token, req }) {
            const isLoggedIn = !!token;
            const isOnApp = new RegExp(`(${routing.locales.join('|')})/app`).test(req.nextUrl.pathname);
            const isOnAdminPage = new RegExp(`(${routing.locales.join('|')})/app/administration`).test(req.nextUrl.pathname);

            if (isOnAdminPage) {
                if (isLoggedIn && token.roles.includes('ADMIN')) return true;
                return false; // Redirect unauthorized users to home page
            }

            if (isOnApp) {
                if (!isLoggedIn) return false;

                const isOnContainerPageRegExp = new RegExp(`(${routing.locales.join('|')})/app/containers/(.*)`);

                if (isOnContainerPageRegExp.test(req.nextUrl.pathname)) {
                    const match = req.nextUrl.pathname.match(isOnContainerPageRegExp);
                    if (!match) return false;
                    const containerId = match[2];

                    const isAllowed = await fetch(`${process.env.NEXTAUTH_URL}/api/users/check-container?containerId=${containerId.toString()}`, {
                        method: 'POST',
                        body: JSON.stringify({
                            user: token.id
                        })
                    });

                    if (!isAllowed.ok) return false;

                    return true;
                }

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

