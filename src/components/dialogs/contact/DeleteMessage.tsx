import { deleteContactMessage } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";


export default function DeleteMessage({ children, messageId, open, setOpen }: { children?: React.ReactNode, messageId: string, open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

    const t = useTranslations("dialogs.contact.message.actions.delete");
    const [loadingMessageDelete, setLoadingMessageDelete] = React.useState(false);


    const handleDeleteMessage = async (messageId: string) => {
        setLoadingMessageDelete(true);

        const r = await deleteContactMessage(messageId);

        setLoadingMessageDelete(false);

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
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children
                ? <DialogTrigger asChild>{children}</DialogTrigger>
                : null}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>{t('description')}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"}>{t('actions.cancel')}</Button>
                    </DialogClose>
                    {loadingMessageDelete
                        ? <Button variant={"destructive"} disabled><Loader2 className="animate-spin" /> {t('actions.submitting')}</Button>
                        : <Button onClick={() => handleDeleteMessage(messageId)} variant={"destructive"}>{t('actions.submit')}</Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}