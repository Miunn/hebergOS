import { DataTable } from "../ui/data-table";
import { robotoMono } from "@/ui/fonts";
import { NumberTicker } from "../ui/number-ticker";
import { useTranslations } from "next-intl";
import { NotificationWithUserAndContainer } from "@/lib/definitions";
import { NotificationState } from "@prisma/client";
import { notificationsAdminColumns } from "./notifications-admin-columns";

export default function NotificationAdminTable({ notifications }: { notifications: NotificationWithUserAndContainer[] }) {

    const t = useTranslations('pages.app.container.asks');

    return (
        <DataTable
            columns={notificationsAdminColumns}
            data={notifications.sort((a, b) => {
                if (a.state === NotificationState.CANCELED && b.state !== NotificationState.CANCELED) return 1;
                if (a.state !== NotificationState.CANCELED && b.state === NotificationState.CANCELED) return -1;

                return b.createdAt.getTime() - a.createdAt.getTime();
            })}
            tableTitle={(
                <h1 className={`${robotoMono.className} text-xl text-primary font-semibold`}>
                    {notifications.length === 0
                        ? <span className="text-secondary">0</span>
                        : <NumberTicker value={notifications.length} className="text-secondary" />
                    } {t('tickets', { count: notifications.length })}
                </h1>
            )}
            filterPlaceholder={t('search')}
            filteredColumn="message"
        />
    )
}