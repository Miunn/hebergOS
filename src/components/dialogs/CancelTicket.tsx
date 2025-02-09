import React from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { cancelTicket } from "@/actions/ticket";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function CancelTicket({ open, setOpen, ticketId }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, ticketId: string }) {
    const t = useTranslations("dialogs.containers.cancelTicket");

    const [loading, setLoading] = React.useState(false);

    const handleDelete = async () => {
        setLoading(true);
        
        const r = await cancelTicket(ticketId);

        setLoading(false);

        if (!r) {
            toast({
                title: t('error.title'),
                description: t('error.description'),
                variant: 'destructive'
            });
            return;
        }

        toast({
            title: t('success.title'),
            description: t('success.description'),
        });

        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>{t('description')}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={() => setOpen(false)}>{t('actions.cancel')}</Button>
                    </DialogClose>
                    {loading
                        ? <Button variant="destructive" disabled><Loader2 className={"animate-spin"} />{t('actions.submitting')}</Button>
                        : <Button variant="destructive" onClick={handleDelete}>{t('actions.submit')}</Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};