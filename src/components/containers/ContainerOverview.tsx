import { useFormatter, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Container, ContainerActivity } from "@prisma/client";
import { robotoMono } from "@/ui/fonts";
import { ContainerWithActivity, ContainerWithUsers } from "@/lib/definitions";

export default function ContainerOverview({ container }: { container: ContainerWithActivity & ContainerWithUsers }) {

    const t = useTranslations("pages.app.container.overview");
    const formatter = useFormatter();

    const renderActivity = (activity: ContainerActivity) => {

        let text;
        switch (activity.type) {
            case "STARTED":
                text = t('activity.started');
                break;
            case "STOPPED":
                text = t('activity.stopped');
                break;
            case "RESTARTED":
                text = t('activity.restarted');
                break;
        }

        return (
            <p key={activity.id} className="flex justify-start gap-4">
                <span>{ formatter.dateTime(activity.createdAt, {day: "2-digit", month: "2-digit", year: "numeric", hour: "numeric", minute: "2-digit"}) }</span>
                <span>{ text }</span>
            </p>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-8">
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle className={`${robotoMono.className}`}>{t('title', { name: container.name })}</CardTitle>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('activity.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {container.containerActivities.map((activity) => (
                        renderActivity(activity)
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('users.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {container.users.map((user) => (
                        <p key={user.id}>
                            {user.name}<br />
                            <i>{user.email}</i>
                        </p>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}