import { getServerSession } from "next-auth"
import Link from "next/link";
import { Button } from "./ui/button";
import { robotoMono } from "@/ui/fonts";
import { LogIn } from "lucide-react";
import UserDropdown from "./UserDropdown";
import AppName from "./AppName";
import ContactUsCta from "./ContactUsCta";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { authConfig, cn } from "@/lib/utils";
import ChangeLocale from "./ChangeLocale";

export default async function Header({ className, locale }: { className?: string, locale: string }) {
    const headerList = headers();

    const session = await getServerSession(authConfig);
    const isOnLandingPage = new RegExp(`^\/(${routing.locales.join('|')})(/contact-us)?$`).test((await headerList).get("X-Current-Path") || '');
    const t = await getTranslations('components.header');

    return (
        <header className={cn(
            "fixed left-0 top-0 z-50 w-full border-b backdrop-blur-[12px]",
            "grid grid-cols-[auto_1fr] md:grid-cols-3 h-20 items-center lg:px-24 md:px-12 px-2",
            className
        )}>
            {/* <Image src={"/favicon.png"} alt="HebergOS" width={48} height={48} /> */}
            <h1 className={`${robotoMono.className} font-bold text-2xl`}>
                {session?.user
                    ? <Link href={"/app"}><AppName /></Link>
                    : <Link href={"/"}><AppName /></Link>
                }
            </h1>
            <h1 className={`hidden md:block ${robotoMono.className} antialiased text-center text-xl text-primary`}>./insa.sh</h1>
            <div>
                <div className="hidden md:flex justify-end items-center gap-4 text-xl">
                    {!session?.user
                        ? <>
                            <ContactUsCta variant={"outline"} />
                            <Button asChild><Link href={"/login"} className="text-lg"><LogIn className="w-6 h-6" /> { t('login') }</Link></Button>
                        </>
                        : null
                    }
                    {session?.user && isOnLandingPage
                        ? <Button variant={"link"}><Link href={"/app"}>{t('goToApp')}</Link></Button>
                        : null
                    }
                    {session?.user && !isOnLandingPage
                        ? <UserDropdown />
                        : null
                    }
                    <ChangeLocale locale={locale} />
                </div>

                <div className="md:hidden flex justify-end items-center gap-4 text-xl">
                    {!session?.user
                        ? <>
                            <ContactUsCta variant={"outline"} />
                            <Button asChild><Link href={"/login"} className="text-lg"><LogIn className="w-6 h-6" /> Connexion</Link></Button>
                        </>
                        : null
                    }
                    {session?.user
                        ? <UserDropdown />
                        : null
                    }

                    <ChangeLocale locale={locale} />
                </div>
            </div>
        </header>
    )
}