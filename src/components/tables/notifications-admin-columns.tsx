import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";
import { NotificationWithUserAndContainer } from "@/lib/definitions";
import CancelTicket from "../dialogs/CancelTicket";

export const notificationsAdminColumns: ColumnDef<NotificationWithUserAndContainer>[] = [
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
        accessorKey: "user_name",
        accessorFn: (row) => row.user.name,
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
        accessorKey: "container_name",
        accessorFn: (row) => row.container.name,
        header: ({ column }) => {
            const t = useTranslations("tables.notifications.columns");

            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {t('container')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        }
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            const t = useTranslations("tables.notifications.columns");

            return <span>{t('type')}</span>
        },
        cell: ({ row }) => {
            const t = useTranslations("tables.notifications.types");

            const types = {
                CONTAINER_MEMORY: t('memory'),
                CONTAINER_CPU: t('cpu'),
                CONTAINER_DELETE: t('delete'),
                OTHER: t('other')
            }

            return <Badge className="text-nowrap">{types[row.original.type]}</Badge>
        }
    },
    {
        accessorKey: "state",
        header: ({ column }) => {
            const t = useTranslations("tables.notifications.columns");

            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {t('state')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        },
        cell: ({ row }) => {
            const t = useTranslations("tables.notifications.states");

            switch (row.original.state) {
                case "CREATED":
                    return <Badge className="bg-blue-600 hover:bg-blue-700">{t('created')}</Badge>
                case "READ":
                    return <Badge className="bg-yellow-600 hover:bg-yellow-700">{t('read')}</Badge>
                case "PROCESSED":
                    return <Badge className="bg-green-600 hover:bg-green-700">{t('processed')}</Badge>
                case "CANCELED":
                    return <Badge className="bg-red-600 hover:bg-red-700">{t('canceled')}</Badge>
            }
        }
    },
    {
        accessorKey: "message",
        header: ({ column }) => {
            const t = useTranslations("tables.notifications.columns");

            return <span>{t('message')}</span>
        },
        cell: ({ row }) => {
            return <span className="line-clamp-4">{row.original.message}</span>
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

            return <span className="capitalize text-nowrap">{formatter.dateTime(row.original.createdAt, { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}</span>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const t = useTranslations("tables.notifications.actions");

            const [openCancelTicket, setOpenCancelTicket] = useState(false);

            return (
                <>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('label')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setOpenCancelTicket(true)} className="font-semibold text-red-500 focus:text-red-500">{t('delete')}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <CancelTicket open={openCancelTicket} setOpen={setOpenCancelTicket} ticketId={row.original.id} />
                </>
            )
        }
    }
]