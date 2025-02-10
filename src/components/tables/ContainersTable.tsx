import { Container } from "@prisma/client";
import { DataTable } from "../ui/data-table";
import { containersColumns } from "./containers-columns";
import CreateContainerDialog from "../dialogs/containers/CreateContainer";
import { Button } from "../ui/button";
import { NumberTicker } from "../ui/number-ticker";
import { robotoMono } from "@/ui/fonts";
import { useTranslations } from "next-intl";

export default function ContainersTable({ containers, availableHostPorts }: { containers: Container[], availableHostPorts: number[] }) {

    const t = useTranslations('pages.app.administration');
    const tableT = useTranslations('tables.containers');

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
            meta={{ t: tableT }}
            tableTitle={(
                <h1 className={`${robotoMono.className} text-xl text-primary font-semibold`}>
                    {containers.length === 0
                        ? <span className="text-secondary">0</span>
                        : <NumberTicker value={containers.length} className="text-secondary" />
                    } {t('containers', { count: containers.length })}
                </h1>
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