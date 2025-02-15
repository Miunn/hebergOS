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
import LinkContainers from "../dialogs/users/LinkContainers"
import React from "react"
import EditRoles from "../dialogs/users/EditRoles"
import DeleteUser from "../dialogs/users/DeleteUser"
import { Role } from "@prisma/client"
import ChangePassword from "../dialogs/users/ChangePassword"
import ChangeMail from "../dialogs/users/ChangeMail"
import ChangeNickname from "../dialogs/users/ChangeNickname"

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
            return <span className={`text-nowrap`}>{name}</span>
        }
    },
    {
        accessorKey: "nickname",
        header: ({ table }) => {
            return <span>{table.options.meta?.t('columns.nickname')}</span>
        }
    },
    {
        accessorKey: "email",
        header: ({ table }) => {
            return <span>{table.options.meta?.t('columns.email')}</span>
        }
    },
    {
        accessorKey: "containers",
        header: ({ table }) => {
            return <span>{table.options.meta?.t('columns.containers')}</span>
        },
        cell: ({ row, table }) => {
            const containers = row.original.containers;

            const sliceLength = 2;

            return (
                <div className="flex flex-wrap gap-2">
                    {containers.slice(0, sliceLength).map((container) => (
                        <Badge key={container.id} className={`${robotoMono.className} p-1`}>{container.name}</Badge>
                    ))}
                    {containers.length > sliceLength
                        ? <HoverCard>
                            <HoverCardTrigger>
                                <Badge className={`${robotoMono.className} p-1 cursor-pointer`}>+ {containers.slice(sliceLength).length}</Badge>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                <div className="">
                                    <h3>{table.options.meta?.t('columns.otherContainers')}</h3>
                                    <ul className="list-disc px-4">
                                        {containers.slice(sliceLength).map((container) => (
                                            <li key={container.id} className={`${robotoMono.className}`}>{container.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                        : null}
                    {containers.length === 0
                        ? <i className="text-nowrap">No containers</i>
                        : null}
                </div>
            )
        }
    },
    {
        accessorKey: "roles",
        header: "Roles",
        cell: ({ row }) => {
            const roles = row.original.userRoles.map((r) => r.role);

            const getRoleColorClass = (role: string) => {
                switch (role) {
                    case Role.ADMIN:
                        return "bg-yellow-600 hover:bg-yellow-600/80";
                    case Role.INFO:
                        return "bg-green-600 hover:bg-green-600/80";
                    case Role.USER:
                        return "bg-green-600 hover:bg-green-600/80";
                    default:
                        return "";
                }
            }

            return <div className="flex gap-2">
                {roles.sort((a, b) => {
                    if (a === Role.ADMIN) return -1;
                    if (b === Role.ADMIN) return 1;

                    if (a === Role.INFO) return -1;
                    if (b === Role.INFO) return 1;

                    return 0;
                }).map((role: string) => (
                    <Badge key={role} className={`${robotoMono.className} ${getRoleColorClass(role)} p-1`}>{role}</Badge>
                ))}
            </div>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const t = useTranslations("tables.users.actions");

            const [openEditContainers, setOpenEditContainers] = React.useState(false);
            const [openEditRoles, setOpenEditRoles] = React.useState(false);
            const [openChangeNickname, setOpenChangeNickname] = React.useState(false);
            const [openChangePassword, setOpenChangePassword] = React.useState(false);
            const [openChangeMail, setOpenChangeMail] = React.useState(false);
            const [openDeleteUser, setOpenDeleteUser] = React.useState(false);

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
                            <DropdownMenuItem onClick={() => setOpenChangeNickname(true)}>{t('changeNickname')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenChangeMail(true)}>{t('changeMail')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenChangePassword(true)}>{t('changePassword')}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setOpenDeleteUser(true)} className="font-semibold text-red-500 focus:text-red-500">{t('delete')}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <LinkContainers user={row.original} open={openEditContainers} setOpen={setOpenEditContainers} />
                    <EditRoles user={row.original} open={openEditRoles} setOpen={setOpenEditRoles} />
                    <ChangeNickname user={row.original} open={openChangeNickname} setOpen={setOpenChangeNickname} />
                    <ChangeMail user={row.original} open={openChangeMail} setOpen={setOpenChangeMail} />
                    <ChangePassword user={row.original} open={openChangePassword} setOpen={setOpenChangePassword} />
                    <DeleteUser user={row.original} open={openDeleteUser} setOpen={setOpenDeleteUser} />
                </>
            )
        }
    }
]