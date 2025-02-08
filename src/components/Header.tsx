import { authConfig } from "@/app/api/auth/[...nextauth]/route"
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
import { cn } from "@/lib/utils";

export default async function Header({ className }: { className?: string }) {
    const headerList = headers();

    const session = await getServerSession(authConfig);
    const isOnLandingPage = new RegExp(`^\/(${routing.locales.join('|')})(/contact-us)?$`).test((await headerList).get("X-Current-Path") || '');
    const t = await getTranslations('components.header');

    return (
        <header className={cn(
            "fixed left-0 top-0 z-50 w-full border-b backdrop-blur-[12px]",
            "w-full grid grid-cols-3 h-20 items-center px-24",
            className
            )}>
            <div className="flex items-center gap-4">
                {/* <Image src={"/favicon.png"} alt="HebergOS" width={48} height={48} /> */}
                <h1 className={`${robotoMono.className} font-bold text-2xl`}>
                    {session?.user
                        ? <Link href={"/app"}><AppName /></Link>
                        : <Link href={"/"}><AppName /></Link>
                    }
                </h1>
            </div>
            <h1 className={`${robotoMono.className} antialiased text-center text-xl text-primary`}>./insa.sh</h1>
            <div className="flex justify-end items-center gap-4 text-xl">
                {!session?.user
                    ? <>
                        <ContactUsCta variant={"outline"} />
                        <Button asChild><Link href={"/login"} className="text-lg"><LogIn className="w-6 h-6" /> Connexion</Link></Button>
                    </>
                    : null
                }
                {session?.user && isOnLandingPage
                    ? <Button variant={"link"}><Link href={"/app"}>{ t('goToApp') }</Link></Button>
                    : <UserDropdown />
                }
            </div>
        </header>
    )
}