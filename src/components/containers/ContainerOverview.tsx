import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Container } from "@prisma/client";
import { robotoMono } from "@/ui/fonts";

export default function ContainerOverview({ container }: { container: Container }) {

    const t = useTranslations("pages.app.container.overview");

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

                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('users.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    
                </CardContent>
            </Card>
        </div>
    )
}