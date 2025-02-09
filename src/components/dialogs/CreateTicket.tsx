'use client'

import { createTicket } from "@/actions/ticket";
import { createUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { CreateTicketFormSchema, RegisterFormSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container, NotificationType, Role } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useSession } from "next-auth/react";
import { Label } from "../ui/label";

export default function CreateTicketDialog({ children, container }: { children: React.ReactNode, container: Container }) {

    const session = useSession();
    const t = useTranslations("dialogs.containers.createTicket");

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof CreateTicketFormSchema>>({
        resolver: zodResolver(CreateTicketFormSchema),
        defaultValues: {
            type: NotificationType.CONTAINER_MEMORY,
            message: ""
        }
    });

    const submitForm = async (data: z.infer<typeof CreateTicketFormSchema>) => {
        setLoading(true);

        const result = await createTicket(container.id, data);

        setLoading(false);

        if (!result) {
            toast({
                title: t('error.title'),
                description: t('error.description'),
                variant: 'destructive'
            })
            return;
        }

        form.reset();

        toast({
            title: t('success.title'),
            description: t('success.description'),
        });

        if (result) {
            setOpen(false);
        }
    }

    const types = [
        {
            id: NotificationType.CONTAINER_MEMORY,
            label: t('form.fields.type.options.memory')
        },
        {
            id: NotificationType.CONTAINER_CPU,
            label: t('form.fields.type.options.cpu')
        },
        {
            id: NotificationType.CONTAINER_DELETE,
            label: t('form.fields.type.options.delete')
        },
        {
            id: NotificationType.OTHER,
            label: t('form.fields.type.options.other')
        }
    ]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>{t('description', { name: container.name })}</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label>{t('form.fields.user.label')}</Label>
                        <Input value={session.data?.user.name} disabled />
                    </div>
                    <div>
                        <Label>{t('form.fields.container.label')}</Label>
                        <Input value={container.name} disabled />
                    </div>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.fields.type.label')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a verified email to display" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={types[0].id}>{types[0].label}</SelectItem>
                                            <SelectItem value={types[1].id}>{types[1].label}</SelectItem>
                                            <SelectItem value={types[2].id}>{types[2].label}</SelectItem>
                                            <SelectItem value={types[3].id}>{types[3].label}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        {t('form.fields.type.description')}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.fields.message.label')}</FormLabel>
                                    <FormControl>
                                        <Textarea className="h-40" placeholder={t('form.fields.message.placeholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant={"outline"}>{t('actions.cancel')}</Button>
                            </DialogClose>
                            {loading
                                ? <Button type="submit" className="flex items-center gap-2" disabled><Loader2 className="animate-spin" /> {t('actions.submitting')}</Button>
                                : <Button type="submit">{t('actions.submit')}</Button>
                            }
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}