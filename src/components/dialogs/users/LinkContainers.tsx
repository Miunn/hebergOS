import { getContainersAdmin } from "@/actions/containers";
import { linkContainers } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { LinkContainersFormSchema, UserWithContainers } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { set, z } from "zod";

export default function LinkContainers({ user, open, setOpen }: { user: UserWithContainers, open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [containers, setContainers] = React.useState<Container[]>([]);

    const t = useTranslations("dialogs.users.linkContainers");
    const [loading, setLoading] = React.useState(false);

    const form = useForm<z.infer<typeof LinkContainersFormSchema>>({
        resolver: zodResolver(LinkContainersFormSchema),
        defaultValues: {
            containers: user.containers.map(c => c.id)
        }
    })

    const submit = async (data: z.infer<typeof LinkContainersFormSchema>) => {
        setLoading(true);

        const r = await linkContainers(user.id, data);

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
        getContainersAdmin().then(setContainers);
    }, [])

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
                            name="containers"
                            render={({ field }) => (
                                <FormItem>

                                    {containers.map(container => (
                                        <FormField
                                            key={container.id}
                                            control={form.control}
                                            name="containers"
                                            render={({ field }) => (
                                                <FormItem key={container.id} className="flex items-center gap-2 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value.includes(container.id)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, container.id])
                                                                    : field.onChange(field.value.filter((v: string) => v !== container.id))
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="mt-0 space-y-0">{container.name}</FormLabel>
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