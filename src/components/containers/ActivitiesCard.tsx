import { ContainerActivity } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ContainerWithActivity } from "@/lib/definitions";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { ScrollText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export default function ActivitiesCard({ container }: { container: ContainerWithActivity }) {

    const t = useTranslations("components.containers.activities");
    const formatter = useFormatter();

    const renderActivity = (activity: ContainerActivity) => {

        let text;
        switch (activity.type) {
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
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-start">
                    {t('title')}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant={"outline"} size={"icon"}>
                                    <ScrollText />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('checkAllTooltip')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {container.containerActivities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5).map((activity) => (
                        renderActivity(activity)
                    ))}
                </div>
                {container.containerActivities.length === 0
                    ? <p className="italic mx-auto text-center">{t('empty')}</p>
                    : null}
            </CardContent>
        </Card>
    )
}