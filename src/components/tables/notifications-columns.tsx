import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";
import { NotificationWithUser } from "@/lib/definitions";
import CancelTicket from "../dialogs/CancelTicket";

export const notificationsColumns: ColumnDef<NotificationWithUser>[] = [
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
        header: ({ column, table }) => {
            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {table.options.meta?.t('columns.user')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        }
    },
    {
        accessorKey: "type",
        header: ({ table }) => {
            return <span>{table.options.meta?.t('columns.type')}</span>
        },
        cell: ({ row, table }) => {
            const types = {
                CONTAINER_MEMORY: table.options.meta?.t('types.memory'),
                CONTAINER_CPU: table.options.meta?.t('types.cpu'),
                CONTAINER_DELETE: table.options.meta?.t('types.delete'),
                OTHER: table.options.meta?.t('types.other')
            }

            return <Badge className="text-nowrap">{types[row.original.type]}</Badge>
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
        cell: ({ row, table }) => {
            switch (row.original.state) {
                case "CREATED":
                    return <Badge className="bg-blue-600 hover:bg-blue-700">{table.options.meta?.t('states.created')}</Badge>
                case "READ":
                    return <Badge className="bg-yellow-600 hover:bg-yellow-700">{table.options.meta?.t('states.read')}</Badge>
                case "PROCESSED":
                    return <Badge className="bg-green-600 hover:bg-green-700">{table.options.meta?.t('states.processed')}</Badge>
                case "CANCELED":
                    return <Badge className="bg-red-600 hover:bg-red-700">{table.options.meta?.t('states.canceled')}</Badge>
            }
        }
    },
    {
        accessorKey: "message",
        header: ({ table }) => {
            return <span>{table.options.meta?.t('columns.message')}</span>
        },
        cell: ({ row }) => {
            return <span className="line-clamp-4">{row.original.message}</span>
        }
    },
    {
        accessorKey: "createdAt",
        header: ({ column, table }) => {
            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {table.options.meta?.t('columns.createdAt')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        },
        cell: ({ row, table }) => {
            const formatter = table.options.meta?.formatter;
            if (!formatter) return null;
            return <span className="capitalize text-nowrap">{formatter.dateTime(row.original.createdAt, { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}</span>
        }
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
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
                            <DropdownMenuLabel>{table.options.meta?.t('actions.label')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setOpenCancelTicket(true)} className="font-semibold text-red-500 focus:text-red-500">{table.options.meta?.t('actions.cancel')}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <CancelTicket open={openCancelTicket} setOpen={setOpenCancelTicket} ticketId={row.original.id} />
                </>
            )
        }
    }
]