import { useFormatter, useTranslations } from "next-intl";
import { Button } from "../../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import React, { Suspense } from "react";
import { Contact } from "@prisma/client";
import { getContactMessages } from "@/actions/contact";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "../../ui/scroll-area";
import DeleteMessage from "./DeleteMessage";

export default function ContactMessages({ children, open, setOpen }: { children?: React.ReactNode, open?: boolean, setOpen?: React.Dispatch<React.SetStateAction<boolean>> }) {

    const t = useTranslations("dialogs.contact");
    const formatter = useFormatter();
    const [messages, setMessages] = React.useState<Contact[]>([]);
    const [messageToDelete, setMessageToDelete] = React.useState<string>("");
    const [openDeleteMessage, setOpenDeleteMessage] = React.useState(false);
    const [openMessage, setOpenMessage] = React.useState(false);
    const [message, setMessage] = React.useState<Contact>({ id: "", name: "", email: "", message: "", createdAt: new Date(), updatedAt: new Date() });

    React.useEffect(() => {
        getContactMessages().then((messages) => {
            if (messages) {
                setMessages(messages);
            }
        });
    }, []);

    React.useEffect(() => {
        if (openDeleteMessage) {
            getContactMessages().then((messages) => {
                if (messages) {
                    setMessages(messages);
                }
            });
        }
    }, [openDeleteMessage]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children
                ? <DialogTrigger>
                    {children}
                </DialogTrigger>
                : null}
            <DialogContent className="w-[800px]">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>{t('description')}</DialogDescription>
                </DialogHeader>

                <Suspense fallback={<div>Loading...</div>}>
                    <ScrollArea className={"space-y-4 h-44 w-full gap-11 flex flex-col pr-4"}>
                        {messages.length === 0
                            ? <p className="text-center italic">{t('empty')}</p>
                            : null
                        }
                        {messages.map((message) => (
                            <div className="flex justify-between items-center w-full max-w-full" onClick={() => {
                                setMessage(message);
                                setOpenMessage(true);
                            }} key={message.id}>
                                <div className="cursor-pointer">
                                    <p className="w-full text-start truncate">{message.name}</p>
                                    <p className="w-full text-start truncate italic">{message.email}</p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="w-6 h-6">
                                        <p>
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal />
                                        </p>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>{t('message.actions.label')}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => {
                                            setMessage(message);
                                            setOpenMessage(true)
                                        }}>{t('message.actions.open')}</DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={`mailto:${message.email}`}>
                                                {t('message.actions.anwser')}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="font-semibold text-red-500 focus:text-red-500" onClick={() => {
                                            setMessageToDelete(message.id);
                                            setOpenDeleteMessage(true);
                                        }}>
                                            {t('message.actions.delete.trigger')}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                    </ScrollArea>
                </Suspense>
                <Dialog open={openMessage} onOpenChange={setOpenMessage}>
                    <DialogContent className="w-[900px]">
                        <DialogHeader>
                            <DialogTitle className="truncate">{message.name}</DialogTitle>
                            <DialogDescription>
                                {message.email} - <span className="capitalize">{formatter.dateTime(message.createdAt, { day: "numeric", weekday: "short", month: "long", year: "numeric", hour: "numeric", minute: "numeric" })}</span>
                            </DialogDescription>
                        </DialogHeader>

                        <ScrollArea className={"h-64 w-full overflow-hidden"}>
                            <p className="text-wrap break-all">{message.message}</p>
                        </ScrollArea>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant={"outline"}>{t('actions.close')}</Button>
                            </DialogClose>
                            <Button>
                                <Link href={`mailto:${message.email}`}>{t('actions.answer')}</Link>
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <DeleteMessage messageId={messageToDelete} open={openDeleteMessage} setOpen={setOpenDeleteMessage} />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"}>{t('actions.close')}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}