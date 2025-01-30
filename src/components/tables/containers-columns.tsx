'use client'

import { Container } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { useTranslations } from "next-intl";

export const containersColumns: ColumnDef<Container>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: () => {
            const t = useTranslations("tables.containers.columns");

            return t('name');
        }
    },
    {
        accessorKey: "state",
        header: () => {
            const t = useTranslations("tables.containers.columns");
            return t('state');
        }
    },
    {
        accessorKey: "hostPort",
        header: () => {
            const t = useTranslations("tables.containers.columns");
            return t('hostPort');
        }
    },
    {
        accessorKey: "memory",
        header: () => {
            const t = useTranslations("tables.containers.columns");
            return t('memory');
        }
    },
    {
        accessorKey: "cpu",
        header: () => {
            const t = useTranslations("tables.containers.columns");
            return t('cpu');
        }
    }
]