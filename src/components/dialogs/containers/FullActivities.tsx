import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContainerWithActivity } from "@/lib/definitions";
import { ContainerActivity } from "@prisma/client";
import { useFormatter, useTranslations } from "next-intl";

export default function FullActivities({ container, children }: { container: ContainerWithActivity, children?: React.ReactNode }) {

    const t = useTranslations("components.containers.activities");
    const formatter = useFormatter();

    const renderActivity = (activity: ContainerActivity) => {

        let text;
        switch (activity.type) {
            case "CREATED":
                text = t('created');
                break;
            case "STARTED":
                text = t('started');
                break;
            case "STOPPED":
                text = t('stopped');
                break;
            case "RESTARTED":
                text = t('restarted');
                break;
            case "MEMORY_UPDATE":
                text = t('memoryUpdate', { memory: activity.message });
                break;
            case "CPU_UPDATE":
                text = t('cpuUpdate', { cpu: activity.message });
                break;
        }

        return (
            <p key={activity.id} className="flex justify-start gap-4">
                <span className="capitalize">{formatter.dateTime(activity.createdAt, { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                <span>{text}</span>
            </p>
        )
    }

    return (
        <Dialog>
            {children
                ? <DialogTrigger asChild>{children}</DialogTrigger>
                : null
            }
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>{t('descriptionFull')}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <ScrollArea className="max-h-64">
                        {container.containerActivities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5).map((activity) => (
                            renderActivity(activity)
                        ))}
                    </ScrollArea>
                </div>
                {container.containerActivities.length === 0
                    ? <p className="italic mx-auto text-center">{t('empty')}</p>
                    : null}
            </DialogContent>
        </Dialog>
    )
}