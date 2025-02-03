import { restartContainer } from "@/actions/containers";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Container } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export default function RestartContainer({ children, container }: { children: React.ReactNode, container: Container }) {

    const t = useTranslations("dialogs.containers.restart");
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const submitRestart = async () => {
        setLoading(true);

        const r = await restartContainer(container.id);

        setLoading(false);

        if (!r) {
            toast({
                title: t('error.title'),
                description: t('error.description'),
            })
            return;
        }

        toast({
            title: t('success.title'),
            description: t('success.description', { name: container.name }),
        })

        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('title', { name: container.name })}</DialogTitle>
                    <DialogDescription>{t('description', { name: container.name })}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"}>{t('actions.cancel')}</Button>
                    </DialogClose>
                    {loading
                        ? <Button disabled><Loader2 className="animate-spin" /> {t('actions.restarting')}</Button>
                        : <Button onClick={submitRestart}>{t('actions.restart')}</Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}