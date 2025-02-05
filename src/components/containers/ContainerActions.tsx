'use client'

import { useFormatter, useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ContainerWithActivity } from "@/lib/definitions";
import { ContainerActivity } from "@prisma/client";
import { Button } from "../ui/button";
import { robotoMono } from "@/ui/fonts";
import StartContainer from "@/components/dialogs/containers/StartContainer";
import StopContainer from "@/components/dialogs/containers/StopContainer";
import RestartContainer from "@/components/dialogs/containers/RestartContainer";
import { DialogTrigger } from "../ui/dialog";
import ActivitiesCard from "./ActivitiesCard";

export default function ContainerActions({ container }: { container: ContainerWithActivity }) {

    const t = useTranslations("pages.app.container.actions");
    const formatter = useFormatter();

    const renderDescription = () => {
        let text;
        switch (container.state) {
            case "RUNNING":
                text = t('descriptionRunning', { name: container.name, time: formatter.relativeTime((container.startedAt || new Date()).getTime()) });
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

    return (
        <div className="grid grid-cols-2 gap-8">
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle className={`${robotoMono.className}`}>{t('title', { name: container.name })}</CardTitle>
                    <CardDescription>{renderDescription()}</CardDescription>
                </CardHeader>
            </Card>

            <ActivitiesCard container={container} />

            <Card className="h-fit">
                <CardHeader>
                    <CardTitle>{t('actions.title')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-6">
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