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

    const sortedContainers = [...containers].sort((a, b) => {
        if (a.hostPort === 0 && b.hostPort === 0) {
            return a.name.localeCompare(b.name);
        }

        if (a.hostPort === 0) return 1;
        if (b.hostPort === 0) return -1;

        return a.name.localeCompare(b.name);
    });

    return (
        <DataTable
            columns={containersColumns}
            data={sortedContainers}
            tableTitle={(
                <h1 className={`${robotoMono.className} text-xl text-primary font-semibold`}><NumberTicker value={containers.length} className="text-secondary" /> {t('containers', { count: containers.length })}</h1>
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