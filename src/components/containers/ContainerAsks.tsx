import NotificationTable from "../tables/NotificationTable";
import { ContainerWithNotificationsAndUsers } from "@/lib/definitions";

export default function ContainerAsks({ container }: { container: ContainerWithNotificationsAndUsers }) {
    return (
        <>
            <NotificationTable container={container} />
        </>
    )
}