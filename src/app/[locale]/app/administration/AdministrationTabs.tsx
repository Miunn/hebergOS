'use client'

import ContainersTable from "@/components/tables/ContainersTable";
import NotificationAdminTable from "@/components/tables/NotificationAdminTable";
import UsersTable from "@/components/tables/UsersTable";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationWithUserAndContainer, UserWithContainers } from "@/lib/definitions";
import { Container } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdministrationTabs({ users, containers, notifications, availableHostPorts }: { users: UserWithContainers[], containers: Container[], notifications: NotificationWithUserAndContainer[], availableHostPorts: number[] }) {

    const { replace } = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations("pages.app.administration.tabs");
    const [tabsValue, setTabsValue] = useState(searchParams.get('tab') || 'containers');

    useEffect(() => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('tab', tabsValue);
        const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
        replace(newUrl);
    }, [tabsValue])

    return (
        <>
            <div className="flex md:hidden items-center gap-2 mb-6">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"} size={"icon"}><MoreHorizontal /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setTabsValue('users')}>{t('users')}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTabsValue('containers')}>{t('containers')}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTabsValue('notifications')}>{t('notifications')}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <h3>{t(tabsValue)}</h3>
            </div>
            <Tabs value={tabsValue} onValueChange={setTabsValue} className="flex flex-col items-center">
                <TabsList className="hidden md:flex w-fit h-auto rounded-l-full rounded-r-full mx-auto mb-6">
                    <TabsTrigger className="w-32 p-2 rounded-l-full" value="users">{t('users')}</TabsTrigger>
                    <TabsTrigger className="w-32 p-2" value="containers">{t('containers')}</TabsTrigger>
                    <TabsTrigger className="w-32 p-2" value="notifications">{t('notifications')}</TabsTrigger>
                </TabsList>
                <TabsContent value="users" className="w-full">
                    <UsersTable users={users} />
                </TabsContent>
                <TabsContent value="containers" className="w-full">
                    <ContainersTable containers={containers} availableHostPorts={availableHostPorts} />
                </TabsContent>
                <TabsContent value="notifications" className="w-full">
                    <NotificationAdminTable notifications={notifications} />
                </TabsContent>
            </Tabs>
        </>
    )
}