import { deleteContainer } from "@/actions/containers";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Container } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export default function DeleteContainer({ children, container, open, setOpen }: { children?: React.ReactNode, container: Container, open?: boolean, setOpen?: React.Dispatch<React.SetStateAction<boolean>> }) {

    const t = useTranslations("dialogs.containers.delete");

    const [loading, setLoading] = React.useState(false);
    const [confirmation, setConfirmation] = React.useState<string>("");

    const onDelete = async () => {
        setLoading(true);

        const r = await deleteContainer(container.id);

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
        <Dialog open={open} onOpenChange={(open) => {
            setConfirmation("");
            if (setOpen) {
                setOpen(open);
            }
        }}>
            {children
                ? <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                : null}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('title', { name: container.name })}</DialogTitle>
                    <DialogDescription>{t('description', { name: container.name })}</DialogDescription>
                </DialogHeader>

                <Label>{t('confirmationInput.label')}</Label>
                <Input placeholder={t('confirmationInput.placeholder', { name: container.name })} onChange={(e) => setConfirmation(e.currentTarget.value)} />

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"}>{t('actions.cancel')}</Button>
                    </DialogClose>
                    {loading
                        ? <Button variant={"destructive"} disabled><Loader2 className="animate-spin" /> {t('actions.deleting')}</Button>
                        : <Button variant={"destructive"} disabled={confirmation !== container.name} onClick={onDelete}>{t('actions.delete')}</Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}