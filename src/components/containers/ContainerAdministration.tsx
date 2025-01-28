import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Container } from "@prisma/client";

export default function ContainerAdministration({ container }: { container: Container }) {

    const t = useTranslations("pages.app.container.administration");

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('title')}</CardTitle>
                <CardDescription>{t('description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{t('hostPort', { port: container.hostPort })}</p>
                <p>{t('memory', { memory: container.memory })}</p>
                <p>{t('cpu', { cpu: container.cpu })}</p>
            </CardContent>
            <CardFooter className="gap-4">
                <Button>{t('actions.changeMemory')}</Button>
                <Button>{t('actions.changeCpu')}</Button>
                <Button>{t('actions.deleteContainer')}</Button>
            </CardFooter>
        </Card>
    )
}