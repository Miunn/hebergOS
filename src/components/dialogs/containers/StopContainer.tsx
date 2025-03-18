import { stopContainer } from "@/actions/containers";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Container } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export default function StopContainer({ children, open, setOpen, container }: { children?: React.ReactNode, open?: boolean, setOpen?: React.Dispatch<React.SetStateAction<boolean>>, container: Container }) {

    const t = useTranslations("dialogs.containers.stop");
    const [loading, setLoading] = React.useState(false);
    const [internalOpen, setInternalOpen] = React.useState(false);
    const openValue = open ?? internalOpen;
    const openSetter = setOpen ?? setInternalOpen;

    const submitStop = async () => {
        setLoading(true);

        const r = await stopContainer(container.id);

        setLoading(false);

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
            description: t('success.description', { name: container.name }),
        })

        openSetter(false);
    }

    return (
        <Dialog open={openValue} onOpenChange={openSetter}>
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
                        ? <Button disabled><Loader2 className="animate-spin" /> {t('actions.stopping')}</Button>
                        : <Button onClick={submitStop}>{t('actions.stop')}</Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}