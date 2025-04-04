import { ContainerActivity } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ContainerWithActivity } from "@/lib/definitions";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { ScrollText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import FullActivities from "../dialogs/containers/FullActivities";
import { ScrollArea } from "../ui/scroll-area";

export default function ActivitiesCard({ container }: { container: ContainerWithActivity }) {

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
            case "DOMAIN_UPDATE":
                text = t('domainUpdate', { domain: activity.message });
                break;
            case "MEMORY_UPDATE":
                text = t('memoryUpdate', { memory: activity.message });
                break;
            case "CPU_UPDATE":
                text = t('cpuUpdate', { cpu: activity.message });
                break;
        }

        return (
            <p key={activity.id} className="grid grid-cols-2 justify-start gap-1">
                <span className="capitalize">{formatter.dateTime(activity.createdAt, { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                <span>{text}</span>
            </p>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-start text-primary">
                    {t('title')}
                    <TooltipProvider>
                        <Tooltip>
                            <FullActivities container={container}>
                                <TooltipTrigger asChild>
                                    <Button variant={"outline"} size={"icon"} className="text-secondary hover:text-secondary">
                                        <ScrollText />
                                    </Button>
                                </TooltipTrigger>
                            </FullActivities>
                            <TooltipContent>
                                <p>{t('checkAllTooltip')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="flex max-h-96 flex-col overflow-y-auto">
                    {container.containerActivities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5).map((activity) => (
                        renderActivity(activity)
                    ))}
                </ScrollArea>
                {container.containerActivities.length === 0
                    ? <p className="italic mx-auto text-center">{t('empty')}</p>
                    : null}
            </CardContent>
        </Card>
    )
}