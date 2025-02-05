'use client'

import { changeContainerDomain } from "@/actions/containers";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ChangeDomainFormSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "@prisma/client";
import { ChevronDown, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { title } from "process";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ChangeDomain({ children, container }: { children?: React.ReactNode, container: Container }) {

    const t = useTranslations("dialogs.containers.changeDomain");
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [protocolValue, setProtocolValue] = React.useState("https://");

    const form = useForm<z.infer<typeof ChangeDomainFormSchema>>({
        resolver: zodResolver(ChangeDomainFormSchema),
        defaultValues: {
            domain: container.domain || ''
        }
    })

    const submit = async (data: z.infer<typeof ChangeDomainFormSchema>) => {
        setLoading(true);

        data.domain = protocolValue + data.domain;
        const r = await changeContainerDomain(container.id, data);

        if (!r) {
            toast({
                title: t('error.title'),
                description: t('error.description'),
                variant: 'destructive'
            })
            return;
        }

        toast({
            title: t('success.title'),
            description: t('success.description'),
        });

        setOpen(false);

        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children
                ? <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                : null
            }
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('title', { name: container.name })}</DialogTitle>
                    <DialogDescription>{t('description', { name: container.name })}</DialogDescription>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(submit)}>

                            <FormField
                                control={form.control}
                                name="domain"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('form.fields.domain.label')}</FormLabel>
                                        <FormControl >
                                            <div className="flex rounded-lg shadow-sm shadow-black/5">
                                                <div className="relative">
                                                    <Select value={protocolValue} onValueChange={setProtocolValue}>
                                                        <SelectTrigger className="rounded-r-none" aria-label="Protocol">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="https://">https://</SelectItem>
                                                            <SelectItem value="http://">http://</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <Input
                                                    className="-ms-px rounded-s-none shadow-none focus-visible:z-10"
                                                    placeholder="google.com"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription>{t('form.fields.domain.description')}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="mt-4">
                                <DialogClose asChild>
                                    <Button variant={"outline"}>{t('actions.cancel')}</Button>
                                </DialogClose>
                                {loading
                                    ? <Button type="submit" disabled><Loader2 className="animate-spin" /> {t('actions.submitting')}</Button>
                                    : <Button type="submit">{t('actions.submit')}</Button>
                                }
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}