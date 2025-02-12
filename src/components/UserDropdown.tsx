'use client'

import { Bell, LogOut, MessagesSquare, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import ContactMessages from "./dialogs/contact/ContactMessages";
import React from "react";
import { Role } from "@prisma/client";

export default function UserDropdown() {

    const user = useSession().data?.user;
    const t = useTranslations("components.users.userDropdown");

    const handleLogout = async () => {
        signOut();
    }

    const [openMessages, setOpenMessages] = React.useState(false);

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant={"link"} className="text-inherit text-base">{user?.name}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-40">
                    <DropdownMenuLabel>{t('label')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem><Bell /> {t('notifications')}</DropdownMenuItem>
                        {user?.roles.includes(Role.ADMIN)
                            ? <DropdownMenuItem asChild>
                                <Link href={"/app/administration"}>
                                    <Shield /> {t('administration')}
                                </Link>
                            </DropdownMenuItem>
                            : null
                        }
                        {user?.roles.includes(Role.ADMIN)
                            ? <DropdownMenuItem onClick={() => setOpenMessages(true)}>
                                <MessagesSquare /> {t('messages')}
                            </DropdownMenuItem>
                            : null
                        }
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut /> {t('logout')}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu >
            <ContactMessages open={openMessages} setOpen={setOpenMessages} />
        </>
    )
}