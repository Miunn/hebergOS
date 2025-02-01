import { UserWithContainers } from "@/lib/definitions";
import { DataTable } from "../ui/data-table";
import { usersColumns } from "./users-columns";
import { getTranslations } from "next-intl/server";
import CreateUserDialog from "../dialogs/users/CreateUser";
import { Button } from "../ui/button";
import { robotoMono } from "@/ui/fonts";
import { NumberTicker } from "../ui/number-ticker";

export default async function UsersTable({ users }: { users: UserWithContainers[] }) {

    const t = await getTranslations('pages.app.administration');

    return (
        <DataTable
            columns={usersColumns}
            data={users}
            tableTitle={(
                <h1 className={`${robotoMono.className} text-xl`}><NumberTicker value={users.length} /> {t('users', { count: users.length })}</h1>
    )}
            rightContent={(
                <CreateUserDialog>
                    <Button variant={"secondary"}>
                        { t('createUser') }
                    </Button>
                </CreateUserDialog>
            )}
            filterPlaceholder={ t('searchUsers') }
            filteredColumn="nickname"
        />
    )
}