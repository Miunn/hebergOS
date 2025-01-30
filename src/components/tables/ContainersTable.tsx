import { Container } from "@prisma/client";
import { DataTable } from "../ui/data-table";
import { containersColumns } from "./containers-columns";

export default function ContainersTable({ containers }: { containers: Container[] }) {
    return (
        <DataTable
            columns={containersColumns}
            data={containers}
        />
    )
}