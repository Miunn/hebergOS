import { UserWithContainers } from "@/lib/definitions";
import { DataTable } from "../ui/data-table";
import { usersColumns } from "./users-columns";

export default function UsersTable({ users }: { users: UserWithContainers[] }) {
    return (
        <DataTable
            columns={usersColumns}
            data={users}
        />
    )
}