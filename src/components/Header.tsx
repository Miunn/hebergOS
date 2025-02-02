import { authConfig } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import Link from "next/link";
import { Button } from "./ui/button";
import { robotoMono } from "@/ui/fonts";
import { LogIn } from "lucide-react";
import UserDropdown from "./UserDropdown";

export default async function Header() {
    const session = await getServerSession(authConfig);

    return (
        <header className="w-full grid grid-cols-3 h-20 items-center px-11 bg-primary text-white">
            <h1 className="font-bold text-xl">
                {session?.user
                    ? <Link href={"/app"} className="text-white">HebergOS</Link>
                    : <Link href={"/"} className="text-white">HebergOS</Link>
                }
            </h1>
            <h1 className={`${robotoMono.className} antialiased text-center text-xl`}>./insa.sh</h1>
            <div className="flex justify-end items-center gap-4 text-xl">
                {session?.user
                    ? <UserDropdown />
                    : <>
                        <Button variant={"link"} asChild><Link href={"/login"} className="text-white text-lg"><LogIn className="w-6 h-6" /> Connexion</Link></Button>
                    </>
                }
            </div>
        </header>
    )
}