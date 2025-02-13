import { changeMail, changePassword } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ChangeMailFormSchema, ChangePasswordFormSchema, UserLight } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ChangeMail({ user, children, open, setOpen }: { user: UserLight, children?: React.ReactNode, open?: boolean, setOpen?: React.Dispatch<React.SetStateAction<boolean>> }) {

    const t = useTranslations("dialogs.users.changeMail");
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof ChangeMailFormSchema>>({
        resolver: zodResolver(ChangeMailFormSchema),
        defaultValues: {
            email: user.email || "",
        }
    });

    const submit = async (data: z.infer<typeof ChangeMailFormSchema>) => {
        setLoading(true);

        const r = await changeMail(user.id, data);

        setLoading(false);

        if (!r) {
            toast({
                title: t('error.title'),
                description: t('error.description'),
                variant: "destructive"
            });
            return;
        }

        toast({
            title: t('success.title'),
            description: t('success.description'),
        });

        form.reset();

        form.setValue("email", data.email);

        if (setOpen) {
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children
                ? <DialogTrigger>
                    {children}
                </DialogTrigger>
                : null
            }
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>{t('description', { name: user.name })}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)} className="space-y-4">

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

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant={"outline"}>{t('actions.cancel')}</Button>
                            </DialogClose>
                            {loading
                                ? <Button disabled><Loader2 className="animate-spin" /> {t('actions.submitting')}</Button>
                                : <Button type="submit">{t('actions.submit')}</Button>
                            }
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}