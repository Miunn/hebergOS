import { deleteUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { UserLight } from "@/lib/definitions";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { SetStateAction } from "react";

export default function DeleteUser({ user, open, setOpen }: { user: UserLight, open?: boolean, setOpen?: React.Dispatch<SetStateAction<boolean>> }) {

    const t = useTranslations("dialogs.users.delete");
    const [loading, setLoading] = React.useState<boolean>(false);

    const [confirmation, setConfirmation] = React.useState<string>("");

    const handleDelete = async () => {
        setLoading(true);

        const r = await deleteUser(user.id);

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
            description: t('success.description', { name: user.name }),
        });

        if (setOpen) {
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(open) => {
            setConfirmation("");
            if (setOpen) {
                setOpen(open);
            }
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('title', { name: user.name })}</DialogTitle>
                    <DialogDescription>{t('description', { name: user.name })}</DialogDescription>
                </DialogHeader>

                <Label>{t('confirmationInput.label')}</Label>
                <Input placeholder={t('confirmationInput.placeholder', { name: user.name })} onChange={(e) => setConfirmation(e.currentTarget.value)} />

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"}>{t('actions.cancel')}</Button>
                    </DialogClose>
                    {loading
                        ? <Button variant={"destructive"} disabled><Loader2 className="animate-spin" /> {t('actions.submitting')}</Button>
                        : <Button variant={"destructive"} disabled={confirmation !== user.name} onClick={handleDelete}>{t('actions.submit')}</Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}