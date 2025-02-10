'use client'

import { Container, ContainerState } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { useTranslations } from "next-intl";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import DeleteContainer from "../dialogs/containers/DeleteContainer";
import { useState } from "react";
import EditMemoryLimitContainer from "../dialogs/containers/EditMemoryLimitContainer";
import EditCpuLimitContainer from "../dialogs/containers/EditCpuLimitContainer";
import Link from "next/link";
import { Badge } from "../ui/badge";

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
                className="border-black"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="border-black"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column, table }) => {
            const t = useTranslations("tables.containers.columns");

            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {table.options.meta?.t('columns.name')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        },
        cell: ({ row }) => {
            const name = row.original.name;
            return <Button variant={"link"} asChild>
                <Link href={`/app/containers/${row.original.id}`} className="!text-black">{name}</Link>
            </Button>
        }
    },
    {
        accessorKey: "state",
        header: ({ column, table }) => {
            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {table.options.meta?.t('columns.state')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        },
        cell: ({ row }) => {
            const state = row.original.state;

            const getStateColor = (state: ContainerState) => {
                switch (state) {
                    case "CREATED":
                        return `bg-blue-600 hover:bg-blue-700`;
                    case "RUNNING":
                        return `bg-green-600 hover:bg-green-700`;
                    case "PAUSED":
                        return `bg-yellow-600 hover:bg-yellow-700`;
                    case "RESTARTING":
                        return `bg-purple-600 hover:bg-purple-700`;
                    case "STOPPED":
                        return `bg-red-600 hover:bg-red-700`;
                    default:
                        return `bg-gray-600 hover:bg-gray-700`;
                }
            }

            return <Badge className={`${getStateColor(state)} capitalize`}>{state.toLowerCase()}</Badge>
        }
    },
    {
        accessorKey: "hostPort",
        header: ({ column, table }) => {

            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {table.options.meta?.t('columns.hostPort')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        }
    },
    {
        accessorKey: "memory",
        header: ({ column, table }) => {
            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {table.options.meta?.t('columns.memory')}
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
        header: ({ column, table }) => {
            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {table.options.meta?.t('columns.cpu')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        },
        cell: ({ row }) => {
            const cpu = row.original.cpu;
            return <span>{cpu} %</span>
        }
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const state = row.original.state;

            const [openEditMemory, setOpenEditMemory] = useState(false);
            const [openEditCpu, setOpenEditCpu] = useState(false);
            const [openDelete, setOpenDelete] = useState(false);

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{table.options.meta?.t('actions.label')}</DropdownMenuLabel>
                            <DropdownMenuItem>{ table.options.meta?.t('actions.open') }</DropdownMenuItem>
                            {state === "RUNNING"
                                ? <DropdownMenuItem>{table.options.meta?.t('actions.stop')}</DropdownMenuItem>
                                : <DropdownMenuItem>{table.options.meta?.t('actions.start')}</DropdownMenuItem>
                            }
                            <DropdownMenuItem onClick={() => setOpenEditMemory(true)}>{table.options.meta?.t('actions.editMemory')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenEditCpu(true)}>{table.options.meta?.t('actions.editCpu')}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setOpenDelete(true)} className="font-semibold text-red-500 focus:text-red-500">{table.options.meta?.t('actions.delete')}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <EditMemoryLimitContainer container={row.original} open={openEditMemory} setOpen={setOpenEditMemory} />
                    <EditCpuLimitContainer container={row.original} open={openEditCpu} setOpen={setOpenEditCpu} />
                    <DeleteContainer container={row.original} open={openDelete} setOpen={setOpenDelete} />
                </>
            )
        }
    }
]