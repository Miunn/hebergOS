import { Notification } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";

export const notificationsColumns: ColumnDef<Notification>[] = [
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
        accessorKey: "user.name",
        header: ({ column }) => {
            const t = useTranslations("tables.notifications.columns");

            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {t('user')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        }
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            const t = useTranslations("tables.notifications.columns");

            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {t('type')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        },
        cell: ({ row }) => {
            const t = useTranslations("tables.notifications.columns");

            return <Badge>{ row.original.type }</Badge>
        }
    },
    {
        accessorKey: "message",
        header: ({ column }) => {
            const t = useTranslations("tables.notifications.columns");

            return <span>{t('message')}</span>
        }
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            const t = useTranslations("tables.notifications.columns");

            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {t('createdAt')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        },
        cell: ({ row }) => {
            const t = useTranslations("tables.notifications.columns");
            const formatter = useFormatter();

            return <span>{ formatter.dateTime(row.original.createdAt, { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }) }</span>
        }   
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const t = useTranslations("tables.users.actions");

            const [openEditContainers, setOpenEditContainers] = useState(false);
            const [openEditRoles, setOpenEditRoles] = useState(false);
            const [openDeleteUser, setOpenDeleteUser] = useState(false);

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
                            <DropdownMenuLabel>{t('label')}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setOpenEditContainers(true)}>{t('editContainers')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenEditRoles(true)}>{t('editRoles')}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setOpenDeleteUser(true)} className="font-semibold text-red-500 focus:text-red-500">{t('delete')}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        }
    }
]