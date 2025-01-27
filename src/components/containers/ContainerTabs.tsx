import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ContainerOverview from "./ContainerOverview";
import ContainerGraphs from "./ContainerGraphs";
import ContainerShell from "./ContainerShell";
import ContainerAdministration from "./ContainerAdministration";
import ContainerActions from "./ContainerActions";
import ContainerAsks from "./ContainerAsks";
import { ContainerWithActivity, ContainerWithNotifications, ContainerWithUsers } from "@/lib/definitions";

export default function ContainerTabs({ container }: { container: ContainerWithActivity & ContainerWithUsers & ContainerWithNotifications }) {

    const t = useTranslations("pages.app.container.tabs");

    return (
        <Tabs defaultValue="overview">
            <TabsList className="block w-fit h-auto rounded-l-full rounded-r-full mx-auto mb-11">
                <TabsTrigger className="w-32 p-2 rounded-l-full" value="overview">{ t('overview') }</TabsTrigger>
                <TabsTrigger className="w-32 p-2" value="graphs">{ t('graphs') }</TabsTrigger>
                <TabsTrigger className="w-32 p-2" value="shell">{ t('shell') }</TabsTrigger>
                <TabsTrigger className="w-32 p-2" value="actions">{ t('actions') }</TabsTrigger>
                <TabsTrigger className="w-32 p-2" value="admin">{ t('admin') }</TabsTrigger>
                <TabsTrigger className="w-32 p-2 rounded-r-full" value="asks">{ t('asks') }</TabsTrigger>
            </TabsList>
            <TabsContent value="overview"><ContainerOverview container={container} /></TabsContent>
            <TabsContent value="graphs"><ContainerGraphs /></TabsContent>
            <TabsContent value="shell"><ContainerShell container={container} /></TabsContent>
            <TabsContent value="actions"><ContainerActions container={container} /></TabsContent>
            <TabsContent value="admin"><ContainerAdministration /></TabsContent>
            <TabsContent value="asks"><ContainerAsks /></TabsContent>
        </Tabs>
    )
}