import { Notification } from "@prisma/client";
import NotificationTable from "../tables/NotificationTable";

export default function ContainerAsks({ containerNotifications }: { containerNotifications: Notification[] }) {
    return (
        <>
            <NotificationTable notifications={containerNotifications} />
        </>
    )
}