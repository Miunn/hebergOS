import { UserWithContainers } from "@/lib/definitions";
import { DataTable } from "../ui/data-table";
import { usersColumns } from "./users-columns";
import CreateUserDialog from "../dialogs/users/CreateUser";
import { Button } from "../ui/button";
import { robotoMono } from "@/ui/fonts";
import { NumberTicker } from "../ui/number-ticker";
import { Role } from "@prisma/client";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

export default function UsersTable({ users }: { users: UserWithContainers[] }) {

    const t = useTranslations('pages.app.administration');
    const tableT = useTranslations('tables.users');

    return (
        <DataTable
            columns={usersColumns}
            data={users.sort((a, b) => {
                // Sort by admin role first
                const aRoles = a.userRoles.map((r) => r.role);
                const bRoles = b.userRoles.map((r) => r.role);
                if (aRoles.includes(Role.ADMIN) && !bRoles.includes(Role.ADMIN)) return -1;
                if (!aRoles.includes(Role.ADMIN) && bRoles.includes(Role.ADMIN)) return 1;
                // Then sort by name
                return a.name.localeCompare(b.name);
            })}
            meta={{ t: tableT }}
            tableTitle={(
                <h1 className={`${robotoMono.className} text-xl truncate text-primary font-semibold`}>
                    {users.length === 0
                        ? <span className="text-secondary">0</span>
                        : <NumberTicker value={users.length} className="text-secondary" />
                    } {t('users', { count: users.length })} </h1>
            )}
            rightContent={(
                <CreateUserDialog>
                    <Button variant={"secondary"}>
                        <span className="hidden md:inline">{t('createUser')}</span>
                        <Plus className="block md:hidden" />
                    </Button>
                </CreateUserDialog>
            )}
            filterPlaceholder={t('searchUsers')}
            filteredColumn="nickname"
        />
    )
}