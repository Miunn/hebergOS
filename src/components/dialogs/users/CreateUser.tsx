'use client'

import { createUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { RegisterFormSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CreateUserDialog({ children }: { children: React.ReactNode }) {

    const t = useTranslations("dialogs.users.create");

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof RegisterFormSchema>>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            name: "",
            email: "",
            nickname: "",
            password: "",
            passwordConfirmation: "",
            roles: ["USER"],
        }
    });

    const submitForm = async (data: z.infer<typeof RegisterFormSchema>) => {
        setLoading(true);

        const result = await createUser(data);

        setLoading(false);

        if (result.error) {
            if (result.error === 'nickname-already-exists') {
                toast({
                    title: t('errors.nicknameAlreadyExists.title'),
                    description: t('errors.nicknameAlreadyExists.description'),
                    variant: 'destructive'
                })
            }

            if (result.error === 'email-already-exists') {
                toast({
                    title: t('errors.emailAlreadyExists.title'),
                    description: t('errors.emailAlreadyExists.description'),
                    variant: 'destructive'
                })
            }

            if (result.error === 'invalid-data') {
                toast({
                    title: t('errors.invalidData.title'),
                    description: t('errors.invalidData.description'),
                    variant: 'destructive'
                })
            }

            toast({
                title: t('errors.unknown.title'),
                description: t('errors.unknown.description'),
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

    const roles = [
        {
            id: Role.USER,
            label: t('form.fields.roles.options.user')
        },
        {
            id: Role.INFO,
            label: t('form.fields.roles.options.info')
        },
        {
            id: Role.ADMIN,
            label: t('form.fields.roles.options.admin')
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
                    <DialogDescription>{t('description')}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('form.fields.name.label')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('form.fields.name.placeholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nickname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('form.fields.nickname.label')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('form.fields.nickname.placeholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.fields.email.label')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('form.fields.email.placeholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.fields.password.label')}</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder={t('form.fields.password.placeholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="passwordConfirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.fields.passwordConfirmation.label')}</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder={t('form.fields.passwordConfirmation.placeholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="roles"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel>{t('form.fields.roles.label')}</FormLabel>
                                        <FormDescription>{t('form.fields.roles.description')}</FormDescription>
                                    </div>
                                    {roles.map((role) => (
                                        <FormField
                                            key={role.id}
                                            control={form.control}
                                            name="roles"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={role.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(role.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, role.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== role.id
                                                                            )
                                                                        )
                                                                }}
                                                                disabled={role.id === Role.USER}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="text-sm font-normal">{role.label}</FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
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