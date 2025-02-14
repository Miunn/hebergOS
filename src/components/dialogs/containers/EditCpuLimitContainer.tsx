import { editAdminCpuLimit } from "@/actions/containers";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { EditCpuLimitContainerFormSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function EditCpuLimitContainer({ children, container, open, setOpen }: { children?: React.ReactNode, container: Container, open?: boolean, setOpen?: React.Dispatch<React.SetStateAction<boolean>> }) {

    const t = useTranslations("dialogs.containers.editCpuLimit");
    const form = useForm<z.infer<typeof EditCpuLimitContainerFormSchema>>({
        resolver: zodResolver(EditCpuLimitContainerFormSchema),
        defaultValues: {
            cpu: container.cpu
        }
    })
    const [loading, setLoading] = React.useState(false);

    const onSubmit = async (data: z.infer<typeof EditCpuLimitContainerFormSchema>) => {
        setLoading(true);

        const r = await editAdminCpuLimit(container.id, data);

        setLoading(false);

        if (r) {
            toast({
                title: t('success.title'),
                description: t('success.description')
            })
            if (setOpen) {
                setOpen(false);
            }
        } else {
            toast({
                title: t('error.title'),
                description: t('error.description'),
                variant: "destructive"
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children
                ? <DialogTrigger asChild>

                </DialogTrigger>
                : null}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{ t('title', { name: container.name }) }</DialogTitle>
                    <DialogDescription>{ t('description', { name: container.name }) }</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>

                        <FormField
                            control={form.control}
                            name="cpu"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{ t('form.fields.cpu.label') }</FormLabel>
                                    <FormControl>
                                        <Input placeholder={ t('form.fields.cpu.placeholder') } type="number" {...field} />
                                    </FormControl>
                                    <FormDescription>{ t('form.fields.cpu.description') }</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant={"outline"}>{ t('actions.cancel') }</Button>
                            </DialogClose>
                            {loading
                                ? <Button type="submit" disabled><Loader2 className="animate-spin" /> { t('actions.submitting') }</Button>
                                : <Button type="submit">{ t('actions.submit') }</Button>}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}