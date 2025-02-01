import { Container } from "@prisma/client";
import { DataTable } from "../ui/data-table";
import { containersColumns } from "./containers-columns";
import { getTranslations } from "next-intl/server";
import CreateContainerDialog from "../dialogs/containers/CreateContainer";
import { Button } from "../ui/button";
import { getAvailableHostPorts } from "@/actions/containers";
import { NumberTicker } from "../ui/number-ticker";
import { robotoMono } from "@/ui/fonts";

export default async function ContainersTable({ containers }: { containers: Container[] }) {

    const t = await getTranslations('pages.app.administration');
    const availableHostPorts = await getAvailableHostPorts();

    return (
        <DataTable
            columns={containersColumns}
            data={containers.sort((a, b) => a.name.localeCompare(b.name))}
            tableTitle={(
                <h1 className={`${robotoMono.className} text-xl`}><NumberTicker value={containers.length} /> {t('containers', { count: containers.length })}</h1>
            )}
            rightContent={(
                <CreateContainerDialog availableHostPorts={availableHostPorts}>
                    <Button variant={"secondary"}>
                        {t('createContainer')}
                    </Button>
                </CreateContainerDialog>
            )}
            filterPlaceholder={t('searchContainers')}
            filteredColumn="name"
        />
    )
}