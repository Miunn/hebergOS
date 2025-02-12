import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { robotoMono } from "@/ui/fonts";
import { ContainerWithActivity, ContainerWithUsers } from "@/lib/definitions";
import ActivitiesCard from "./ActivitiesCard";

export default function ContainerOverview({ container }: { container: ContainerWithActivity & ContainerWithUsers }) {

    const t = useTranslations("pages.app.container.overview");

    return (
        <div className="grid grid-cols-2 gap-8">
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle className={`${robotoMono.className} text-primary`}>{t('title', { name: container.name })}</CardTitle>
                </CardHeader>
            </Card>

            <ActivitiesCard container={container} />

            <Card className="h-fit">
                <CardHeader>
                    <CardTitle className="text-primary">{t('users.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {container.users.map((user) => (
                        <p key={user.id}>
                            {user.name}<br />
                            <i>{user.email}</i>
                        </p>
                    ))}
                    {container.containerActivities.length === 0
                    ? <p className="italic mx-auto max-w-72 text-wrap text-center">{t('users.empty')}</p>
                    : null}
                </CardContent>
            </Card>
        </div>
    )
}