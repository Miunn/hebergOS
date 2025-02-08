import { DataTable } from "../ui/data-table";
import CreateUserDialog from "../dialogs/users/CreateUser";
import { Button } from "../ui/button";
import { robotoMono } from "@/ui/fonts";
import { NumberTicker } from "../ui/number-ticker";
import { notificationsColumns } from "./notifications-columns";
import { Notification } from "@prisma/client";
import { useTranslations } from "next-intl";

export default function NotificationTable({ notifications }: { notifications: Notification[] }) {

    const t = useTranslations('pages.app.container.asks');
    console.log(notifications);
    console.log("Notification length: ", notifications.length);

    return (
        <DataTable
            columns={notificationsColumns}
            data={notifications.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())}
            tableTitle={(
                <h1 className={`${robotoMono.className} text-xl text-primary font-semibold`}>
                    {notifications.length === 0
                        ? <span className="text-secondary">0</span>
                        : <NumberTicker value={notifications.length} className="text-secondary" />
                    } {t('tickets', { count: notifications.length })}
                </h1>
            )}
            rightContent={(
                <CreateUserDialog>
                    <Button variant={"secondary"}>
                        {t('create')}
                    </Button>
                </CreateUserDialog>
            )}
            filterPlaceholder={t('searchTickets')}
            filteredColumn="message"
        />
    )
}