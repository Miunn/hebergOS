'use client'

import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ContainerOverview from "./ContainerOverview";
import ContainerGraphs from "./ContainerGraphs";
import ContainerShell from "./ContainerShell";
import ContainerActions from "./ContainerActions";
import ContainerAsks from "./ContainerAsks";
import { ContainerWithActivity, ContainerWithNotificationsAndUsers, ContainerWithUsers } from "@/lib/definitions";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function ContainerTabs({ container }: { container: ContainerWithActivity & ContainerWithUsers & ContainerWithNotificationsAndUsers }) {

    const { replace } = useRouter();
    const searchParams = useSearchParams();
    const session = useSession();
    const t = useTranslations("pages.app.container.tabs");

    const [tabsValue, setTabsValue] = useState(searchParams.get('tab') || 'overview');

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
                    <DropdownMenuItem onClick={() => setTabsValue('overview')}>{ t('overview') }</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTabsValue('graphs')}>{ t('graphs') }</DropdownMenuItem>
                    {session.data?.user.roles.some(el => el === Role.ADMIN || el === Role.INFO)
                        ? <DropdownMenuItem onClick={() => setTabsValue('shell')}>{ t('shell') }</DropdownMenuItem>
                        : null}
                    <DropdownMenuItem onClick={() => setTabsValue('actions')}>{ t('actions') }</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTabsValue('asks')}>{ t('asks') }</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <h3>{ t(tabsValue) }</h3>
        </div>
        <Tabs value={tabsValue} onValueChange={setTabsValue} className="flex flex-col items-center">
            <TabsList className="hidden md:flex w-fit h-auto rounded-l-full rounded-r-full mx-auto mb-11">
                <TabsTrigger className="w-32 p-2 rounded-l-full" value="overview">{t('overview')}</TabsTrigger>
                <TabsTrigger className="w-32 p-2" value="graphs">{t('graphs')}</TabsTrigger>
                {session.data?.user.roles.some(el => el === Role.ADMIN || el === Role.INFO)
                    ? <TabsTrigger className="w-32 p-2" value="shell">{t('shell')}</TabsTrigger>
                    : null}
                <TabsTrigger className="w-32 p-2" value="actions">{t('actions')}</TabsTrigger>
                <TabsTrigger className="w-32 p-2 rounded-r-full" value="asks">{t('asks')}</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="w-full"><ContainerOverview container={container} /></TabsContent>
            <TabsContent value="graphs" className="w-full"><ContainerGraphs container={container} /></TabsContent>
            <TabsContent value="shell" className="w-full"><ContainerShell container={container} /></TabsContent>
            <TabsContent value="actions" className="w-full"><ContainerActions container={container} /></TabsContent>
            <TabsContent value="asks" className="w-full"><ContainerAsks container={container} /></TabsContent>
        </Tabs>
        </>
    )
}