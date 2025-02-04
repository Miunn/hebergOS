import { authConfig } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import Link from "next/link";
import { Button } from "./ui/button";
import { robotoMono } from "@/ui/fonts";
import { LogIn } from "lucide-react";
import UserDropdown from "./UserDropdown";
import AppName from "./AppName";
import ContactUs from "./ContactUs";

export default async function Header() {
    const session = await getServerSession(authConfig);

    return (
        <header className="w-full grid grid-cols-3 h-20 items-center px-24 border-b">
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
                {session?.user
                    ? <UserDropdown />
                    : <>
                        <ContactUs variant={"outline"} />
                        <Button asChild><Link href={"/login"} className="text-lg"><LogIn className="w-6 h-6" /> Connexion</Link></Button>
                    </>
                }
            </div>
        </header>
    )
}