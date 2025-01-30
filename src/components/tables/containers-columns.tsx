'use client'

import { Container } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { useTranslations } from "next-intl";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

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
        header: ({ column }) => {
            const t = useTranslations("tables.containers.columns");

            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {t('name')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        }
    },
    {
        accessorKey: "state",
        header: ({ column }) => {
            const t = useTranslations("tables.containers.columns");

            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {t('state')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        }
    },
    {
        accessorKey: "hostPort",
        header: ({ column }) => {
            const t = useTranslations("tables.containers.columns");

            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {t('hostPort')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        }
    },
    {
        accessorKey: "memory",
        header: ({ column }) => {
            const t = useTranslations("tables.containers.columns");

            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {t('memory')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        },
        cell: ({ row }) => {
            const memory = row.original.memory;
            return <span>{memory} Go</span>
        }
    },
    {
        accessorKey: "cpu",
        header: ({ column }) => {
            const t = useTranslations("tables.containers.columns");

            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {t('cpu')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        },
        cell: ({ row }) => {
            const cpu = row.original.cpu;
            return <span>{cpu} %</span>
        }
    }
]