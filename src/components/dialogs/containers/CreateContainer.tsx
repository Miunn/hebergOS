'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateContainerFormSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CreateContainerDialog({ children, availableHostPorts }: { children: React.ReactNode, availableHostPorts: number[] }) {

    const t = useTranslations("dialogs.containers.create");

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof CreateContainerFormSchema>>({
        resolver: zodResolver(CreateContainerFormSchema),
        defaultValues: {
            name: '',
            hostPort: availableHostPorts[0] || 0,
            memory: 0.5,
            cpu: 0.5,
        }
    })

    const submit = async (data: z.infer<typeof CreateContainerFormSchema>) => {

    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>{t('description')}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.fields.name.label')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('form.fields.name.placeholder')} {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="hostPort"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.fields.hostPort.label')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('form.fields.hostPort.placeholder')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {availableHostPorts.map((port) => (
                                                <SelectItem key={port} value={port.toString()}>{port}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="memory"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.fields.memory.label')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('form.fields.name.placeholder')} {...field} />
                                    </FormControl>
                                    <FormDescription>{t('form.fields.memory.description')}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cpu"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.fields.cpu.label')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('form.fields.name.placeholder')} {...field} />
                                    </FormControl>
                                    <FormDescription>{t('form.fields.cpu.description')}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant={"outline"}>{t('actions.cancel')}</Button>
                            </DialogClose>
                            {loading
                                ? <Button type="submit" disabled>{t('actions.submitting')}</Button>
                                : <Button type="submit">{t('actions.submit')}</Button>
                            }
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}