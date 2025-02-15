import { getContainersAdmin, linkUsers } from "@/actions/containers";
import { getUsers, linkContainers } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { ContainerWithUsers, LinkUsersFormSchema, UserLight } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function LinkUsers({ container, children }: { container: ContainerWithUsers, children?: React.ReactNode }) {

    const [open, setOpen] = React.useState(false);
    const [users, setUsers] = React.useState<UserLight[]>([]);

    const t = useTranslations("dialogs.containers.linkUsers");
    const [loading, setLoading] = React.useState(false);

    const form = useForm<z.infer<typeof LinkUsersFormSchema>>({
        resolver: zodResolver(LinkUsersFormSchema),
        defaultValues: {
            users: container.users.map(c => c.id)
        }
    })

    const submit = async (data: z.infer<typeof LinkUsersFormSchema>) => {
        setLoading(true);

        const r = await linkUsers(container.id, data);

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

    React.useEffect(() => {
        getUsers().then(setUsers);
    }, [])

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
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)}>

                        <FormField
                            control={form.control}
                            name="users"
                            render={() => (
                                <FormItem>
                                    <ScrollArea className="flex max-h-96 flex-col overflow-y-auto">
                                        {users.map(user => (
                                            <FormField
                                                key={user.id}
                                                control={form.control}
                                                name="users"
                                                render={({ field }) => (
                                                    <FormItem key={user.id} className="flex items-center gap-2 space-y-0 my-2">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value.includes(user.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, user.id])
                                                                        : field.onChange(field.value.filter((v: string) => v !== user.id))
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="mt-0 space-y-0">{user.name}</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </ScrollArea>
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