'use client'

import ContainersTable from "@/components/tables/ContainersTable";
import NotificationAdminTable from "@/components/tables/NotificationAdminTable";
import UsersTable from "@/components/tables/UsersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationWithUserAndContainer, UserWithContainers } from "@/lib/definitions";
import { Container } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdministrationTabs({ users, containers, notifications, availableHostPorts }: { users: UserWithContainers[], containers: Container[], notifications: NotificationWithUserAndContainer[], availableHostPorts: number[] }) {

    const { replace } = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations("pages.app.administration.tabs");

    return (
        <Tabs defaultValue={searchParams.get('tab') || 'containers'} onValueChange={(value) => {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('tab', value);
            const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
            replace(newUrl);
        }} className="flex flex-col items-center">
            <TabsList className="w-fit h-auto rounded-l-full rounded-r-full mx-auto mb-6">
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
    )
}