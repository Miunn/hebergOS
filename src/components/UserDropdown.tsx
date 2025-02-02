'use client'

import { Bell, LogOut, Shield, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function UserDropdown() {

    const user = useSession().data?.user;
    const t = useTranslations("components.users.userDropdown");

    const handleLogout = async () => {
        signOut();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"}>
                    <UserCircle /> {user?.name}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{t('label')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem><Bell /> {t('notifications')}</DropdownMenuItem>
                    {user?.roles.includes("ADMIN")
                        ? <DropdownMenuItem asChild>
                            <Link href={"/app/administration"}>
                                <Shield /> {t('administration')}
                            </Link>
                        </DropdownMenuItem>
                        : null
                    }
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut /> {t('logout')}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}