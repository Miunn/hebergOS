import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Container } from "@prisma/client";
import { useTranslations } from "next-intl";

export default function RestartContainer({ children, container }: { children: React.ReactNode, container: Container }) {

    const t = useTranslations("dialogs.containers.restart");

    return (
        <Dialog>
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
                    <Button>{t('actions.restart')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}