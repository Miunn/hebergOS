import { UserWithContainers } from "@/lib/definitions";
import { DataTable } from "../ui/data-table";
import { usersColumns } from "./users-columns";
import CreateUserDialog from "../dialogs/users/CreateUser";
import { Button } from "../ui/button";
import { robotoMono } from "@/ui/fonts";
import { NumberTicker } from "../ui/number-ticker";
import { Role } from "@prisma/client";
import { useTranslations } from "next-intl";

export default function UsersTable({ users }: { users: UserWithContainers[] }) {

    const t = useTranslations('pages.app.administration');
    const tableT = useTranslations('tables.users');

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
            meta={{ t: tableT }}
            tableTitle={(
                <h1 className={`${robotoMono.className} text-xl text-primary font-semibold`}>
                    {users.length === 0
                        ? <span className="text-secondary">0</span>
                        : <NumberTicker value={users.length} className="text-secondary" />
                    } {t('users', { count: users.length })} </h1>
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