import { getContainersAdmin } from "@/actions/containers";
import { editRoles, linkContainers } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { EditRolesFormSchema, UserLight } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function EditRoles({ user, open, setOpen }: { user: UserLight, open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

    const t = useTranslations("dialogs.users.editRoles");
    const [loading, setLoading] = React.useState(false);

    const form = useForm<z.infer<typeof EditRolesFormSchema>>({
        resolver: zodResolver(EditRolesFormSchema),
        defaultValues: {
            roles: user.roles
        }
    })

    const submit = async (data: z.infer<typeof EditRolesFormSchema>) => {
        setLoading(true);

        const r = await editRoles(user.id, data);

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

        if (setOpen) {
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('title', { name: user.name })}</DialogTitle>
                    <DialogDescription>{t('description', { name: user.name })}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)}>

                        <FormField
                            control={form.control}
                            name="roles"
                            render={({ field }) => (
                                <FormItem>

                                    {roles.map(role => (
                                        <FormField
                                            key={role.id}
                                            control={form.control}
                                            name="roles"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center gap-2 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value.includes(role.id)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, role.id])
                                                                    : field.onChange(field.value.filter((v: string) => v !== role.id))
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="mt-0 space-y-0">{role.label}</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    ))}

                                    <FormMessage />
                                </FormItem>
                            )} />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant={"outline"}>{t('actions.cancel')}</Button>
                            </DialogClose>
                            {loading
                                ? <Button disabled><Loader2 className={"animate-spin"} /> {t('actions.submitting')}</Button>
                                : <Button type="submit">{t('actions.submit')}</Button>
                            }
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}