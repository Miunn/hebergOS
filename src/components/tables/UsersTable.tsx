import { UserWithContainers } from "@/lib/definitions";
import { DataTable } from "../ui/data-table";
import { usersColumns } from "./users-columns";
import { getTranslations } from "next-intl/server";
import CreateUserDialog from "../dialogs/users/CreateUser";
import { Button } from "../ui/button";
import { robotoMono } from "@/ui/fonts";
import { NumberTicker } from "../ui/number-ticker";
import { Role } from "@prisma/client";

export default async function UsersTable({ users }: { users: UserWithContainers[] }) {

    const t = await getTranslations('pages.app.administration');

    return (
        <DataTable
            columns={usersColumns}
            data={users.sort((a, b) => {
                // Sort by admin role first
                if (a.roles.includes(Role.ADMIN) && !b.roles.includes(Role.ADMIN)) return -1;
                if (!a.roles.includes(Role.ADMIN) && b.roles.includes(Role.ADMIN)) return 1;
                // Then sort by name
                return a.name.localeCompare(b.name);
            })}
            tableTitle={(
                <h1 className={`${robotoMono.className} text-xl text-primary font-semibold`}><NumberTicker value={users.length} className="text-secondary" /> {t('users', { count: users.length })}</h1>
            )}
            rightContent={(
                <CreateUserDialog>
                    <Button variant={"secondary"}>
                        {t('createUser')}
                    </Button>
                </CreateUserDialog>
            )}
            filterPlaceholder={t('searchUsers')}
            filteredColumn="nickname"
        />
    )
}