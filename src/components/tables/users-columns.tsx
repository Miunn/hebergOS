'use client'

import { UserWithContainers } from "@/lib/definitions"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "../ui/checkbox"
import { Badge } from "../ui/badge"
import { robotoMono } from "@/ui/fonts"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { useTranslations } from "next-intl"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

export const usersColumns: ColumnDef<UserWithContainers>[] = [
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
            const t = useTranslations("tables.users.columns");

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
        accessorKey: "nickname",
        header: ({ column }) => {
            const t = useTranslations(("tables.users.columns"));

            return <span>{ t('nickname') }</span>
        }
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            const t = useTranslations("tables.users.columns");

            return <span>{ t('email') }</span>
        }
    },
    {
        accessorKey: "containers",
        header: "Containers",
        cell: ({ row }) => {
            const t = useTranslations("pages.app.administration");
            const containers = row.original.containers;

            return (
                <div className="flex flex-wrap gap-2">
                    {containers.slice(0, 3).map((container) => (
                        <Badge key={container.id} className={`${robotoMono.className} p-1`}>{container.name}</Badge>
                    ))}
                    {containers.length > 3
                        ? <HoverCard>
                            <HoverCardTrigger>
                                <Badge className={`${robotoMono.className} p-1 cursor-pointer`}>+ {containers.slice(3).length}</Badge>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                <div className="">
                                    <h3>{t('otherContainers')}</h3>
                                    <ul className="list-disc px-4">
                                        {containers.slice(3).map((container) => (
                                            <li key={container.id} className={`${robotoMono.className}`}>{container.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                        : null}
                    {containers.length === 0
                        ? <i>No containers</i>
                        : null}
                </div>
            )
        }
    },
    {
        accessorKey: "roles",
        header: "Roles",
        cell: ({ row }) => {
            const roles = row.original.roles;
            return <div className="flex gap-2">
                {roles.map((role: string) => (
                    <Badge key={role} className={`${robotoMono.className} p-1`}>{role}</Badge>
                ))}
            </div>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const t = useTranslations("tables.users.actions");
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('label')}</DropdownMenuLabel>
                        <DropdownMenuItem>{t('editRoles')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('editContainers')}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="font-semibold text-red-500 focus:text-red-500">{t('delete')}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]