import { DataTable } from "../ui/data-table";
import { Button } from "../ui/button";
import { robotoMono } from "@/ui/fonts";
import { NumberTicker } from "../ui/number-ticker";
import { notificationsColumns } from "./notifications-columns";
import { useFormatter, useTranslations } from "next-intl";
import CreateTicketDialog from "../dialogs/CreateTicket";
import { ContainerWithNotificationsAndUsers } from "@/lib/definitions";
import { NotificationState } from "@prisma/client";
import { Plus } from "lucide-react";

export default function NotificationTable({ container }: { container: ContainerWithNotificationsAndUsers }) {

    const t = useTranslations('pages.app.container.asks');
    const tableT = useTranslations('tables.notifications');

    return (
        <DataTable
            columns={notificationsColumns}
            data={container.containerNotifications.sort((a, b) => {
                if (a.state === NotificationState.CANCELED && b.state !== NotificationState.CANCELED) return 1;
                if (a.state !== NotificationState.CANCELED && b.state === NotificationState.CANCELED) return -1;

                return b.createdAt.getTime() - a.createdAt.getTime();
            })}
            meta={{ t: tableT, formatter: useFormatter() }}
            tableTitle={(
                <h1 className={`${robotoMono.className} text-xl text-nowrap text-primary font-semibold`}>
                    {container.containerNotifications.length === 0
                        ? <span className="text-secondary">0</span>
                        : <NumberTicker value={container.containerNotifications.length} className="text-secondary" />
                    } {t('tickets', { count: container.containerNotifications.length })}
                </h1>
            )}
            rightContent={(
                <CreateTicketDialog container={container}>
                    <Button variant={"secondary"}>
                        <span className="hidden md:inline">{t('create')}</span>
                        <Plus className="block md:hidden" />
                    </Button>
                </CreateTicketDialog>
            )}
            filterPlaceholder={t('search')}
            filteredColumn="message"
        />
    )
}