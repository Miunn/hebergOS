import { stopContainer } from "@/actions/containers";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Container } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export default function StopContainer({ children, container }: { children: React.ReactNode, container: Container }) {

    const t = useTranslations("dialogs.containers.stop");
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const submitStop = async () => {
        setLoading(true);

        const r = await stopContainer(container.id);

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
                    <DialogClose>
                        <Button variant={"outline"}>{t('actions.cancel')}</Button>
                    </DialogClose>
                    {loading
                        ? <Button disabled><Loader2 className="animate-spin" /> {t('actions.stopping')}</Button>
                        : <Button onClick={submitStop}>{t('actions.stop')}</Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}