import { getAvailableHostPorts, getContainersAdmin } from "@/actions/containers";
import { getUsers } from "@/actions/user";
import AdministrationTabs from "./AdministrationTabs";
import { getAllTickets } from "@/actions/ticket";

export default async function AdministrationPage() {

    const users = await getUsers();
    const containers = await getContainersAdmin();
    const tickets = await getAllTickets();
    const availableHostPorts = await getAvailableHostPorts();

    return (
        <div className="mt-12">
            <AdministrationTabs
                users={users}
                containers={containers}
                notifications={tickets}
                availableHostPorts={availableHostPorts}
            />
        </div>
    )
}