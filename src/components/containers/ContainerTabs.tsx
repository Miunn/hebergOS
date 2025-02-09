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

export default function ContainerTabs({ container }: { container: ContainerWithActivity & ContainerWithUsers & ContainerWithNotificationsAndUsers }) {

    const { replace } = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations("pages.app.container.tabs");

    return (
        <Tabs defaultValue={searchParams.get('tab') || 'overview'} onValueChange={(value) => {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('tab', value);
            const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
            replace(newUrl);
        }} className="flex flex-col items-center">
            <TabsList className="w-fit h-auto rounded-l-full rounded-r-full mx-auto mb-11">
                <TabsTrigger className="w-32 p-2 rounded-l-full" value="overview">{ t('overview') }</TabsTrigger>
                <TabsTrigger className="w-32 p-2" value="graphs">{ t('graphs') }</TabsTrigger>
                <TabsTrigger className="w-32 p-2" value="shell">{ t('shell') }</TabsTrigger>
                <TabsTrigger className="w-32 p-2" value="actions">{ t('actions') }</TabsTrigger>
                <TabsTrigger className="w-32 p-2 rounded-r-full" value="asks">{ t('asks') }</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="w-full"><ContainerOverview container={container} /></TabsContent>
            <TabsContent value="graphs" className="w-full"><ContainerGraphs container={container} /></TabsContent>
            <TabsContent value="shell" className="w-full"><ContainerShell container={container} /></TabsContent>
            <TabsContent value="actions" className="w-full"><ContainerActions container={container} /></TabsContent>
            <TabsContent value="asks" className="w-full"><ContainerAsks container={container} /></TabsContent>
        </Tabs>
    )
}