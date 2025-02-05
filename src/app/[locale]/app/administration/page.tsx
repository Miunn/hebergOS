import { getContainersAdmin } from "@/actions/containers";
import { getUsers } from "@/actions/user";
import ContainersTable from "@/components/tables/ContainersTable";
import UsersTable from "@/components/tables/UsersTable";
import { getTranslations } from "next-intl/server";

export default async function AdministrationPage() {

    const t = await getTranslations('pages.app.administration');
    const users = await getUsers();
    const containers = await getContainersAdmin();

    return (
        <div className="mt-24 space-y-11">
            <UsersTable users={users} />

            <ContainersTable containers={containers} />
        </div>
    )
}