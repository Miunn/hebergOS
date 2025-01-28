'use client'

import { useFormatter, useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ContainerWithActivity } from "@/lib/definitions";
import { ContainerActivity } from "@prisma/client";
import { Button } from "../ui/button";
import { robotoMono } from "@/ui/fonts";
import StartContainer from "@/dialogs/containers/StartContainer";
import StopContainer from "@/dialogs/containers/StopContainer";
import RestartContainer from "@/dialogs/containers/RestartContainer";
import { DialogTrigger } from "../ui/dialog";

export default function ContainerActions({ container }: { container: ContainerWithActivity }) {

    const t = useTranslations("pages.app.container.actions");
    const formatter = useFormatter();

    const renderDescription = () => {
        let text;
        switch (container.state) {
            case "RUNNING":
                text = t('descriptionRunning', { name: container.name, time: formatter.dateTimeRange(container.startedAt || new Date(), new Date()) });
                break;

            case "STOPPED":
                text = t('descriptionStopped', { name: container.name });
                break;

            case "PAUSED":
                text = t('descriptionPaused', { name: container.name });
                break;

            case "RESTARTING":
                text = t('descriptionRestarting', { name: container.name });
                break;

            case "CREATED":
                text = t('descriptionCreated', { name: container.name });
                break;

            default:
                break;
        }

        return text;
    }

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
                <span>{formatter.dateTime(activity.createdAt, { day: "2-digit", month: "2-digit", year: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                <span>{text}</span>
            </p>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-8">
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle className={`${robotoMono.className}`}>{t('title', { name: container.name })}</CardTitle>
                    <CardDescription>{renderDescription()}</CardDescription>
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
                    <CardTitle>{t('actions.title')}</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-6">
                    <StartContainer container={container}>
                        <DialogTrigger asChild>
                            <Button>{t('actions.start')}</Button>
                        </DialogTrigger>
                    </StartContainer>
                    <StopContainer container={container}>
                        <DialogTrigger asChild>
                            <Button>{t('actions.stop')}</Button>
                        </DialogTrigger>
                    </StopContainer>
                    <RestartContainer container={container}>
                        <DialogTrigger asChild>
                            <Button>{t('actions.restart')}</Button>
                        </DialogTrigger>
                    </RestartContainer>
                </CardContent>
            </Card>
        </div>
    )
}