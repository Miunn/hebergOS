'use client'

import { useFormatter, useTranslations } from "next-intl";
import { ContainerWithActivity } from "@/lib/definitions";
import { robotoMono } from "@/ui/fonts";
import StartContainer from "@/components/dialogs/containers/StartContainer";
import StopContainer from "@/components/dialogs/containers/StopContainer";
import RestartContainer from "@/components/dialogs/containers/RestartContainer";
import { ContainerActivityType, ContainerState } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ActivitiesCard from "@/components/containers/ActivitiesCard";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { set } from "zod";
import { toast } from "@/hooks/use-toast";

export default function DummyContainerActions({ container }: { container: ContainerWithActivity }) {

    const t = useTranslations("pages.app.container.actions");
    const startT = useTranslations("dialogs.containers.start");
    const stopT = useTranslations("dialogs.containers.stop");
    const restartT = useTranslations("dialogs.containers.restart");
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

    const [loadingStart, setLoadingStart] = useState(false);
    const [loadingStop, setLoadingStop] = useState(false);
    const [loadingRestart, setLoadingRestart] = useState(false);

    const [openStart, setOpenStart] = useState(false);
    const [openStop, setOpenStop] = useState(false);
    const [openRestart, setOpenRestart] = useState(false);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="md:col-span-2">
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
                    <Dialog open={openStart} onOpenChange={setOpenStart}>
                        <DialogTrigger asChild>
                            <Button disabled={container.state === ContainerState.RUNNING || container.state === ContainerState.RESTARTING}>{startT('actions.start')}</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{startT('title', { name: container.name })}</DialogTitle>
                                <DialogDescription>{startT('description', { name: container.name })}</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant={"outline"}>{startT('actions.cancel')}</Button>
                                </DialogClose>
                                {loadingStart
                                    ? <Button disabled><Loader2 className="animate-spin" /> {startT('actions.starting')}</Button>
                                    : <Button onClick={() => {
                                        setLoadingStart(true);

                                        setTimeout(() => {
                                            container.state = ContainerState.RUNNING;
                                            container.containerActivities.push({
                                                id: container.containerActivities.length.toString(),
                                                containerId: "1",
                                                type: ContainerActivityType.STARTED,
                                                message: '1.5',
                                                createdAt: new Date(),
                                                updatedAt: new Date(),
                                            });
                                            setOpenStart(false);
                                            setLoadingStart(false);

                                            toast({
                                                title: startT('success.title'),
                                                description: startT('success.description', { name: container.name }),
                                            })
                                        }, 250);

                                    }}>{startT('actions.start')}</Button>
                                }
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={openStop} onOpenChange={setOpenStop}>
                        <DialogTrigger asChild>
                            <Button disabled={container.state !== ContainerState.RUNNING}>{stopT('actions.stop')}</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{stopT('title', { name: container.name })}</DialogTitle>
                                <DialogDescription>{stopT('description', { name: container.name })}</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant={"outline"}>{stopT('actions.cancel')}</Button>
                                </DialogClose>
                                {loadingStop
                                    ? <Button disabled><Loader2 className="animate-spin" /> {stopT('actions.stopping')}</Button>
                                    : <Button onClick={() => {
                                        setLoadingStop(true);

                                        setTimeout(() => {
                                            container.state = ContainerState.STOPPED;
                                            container.containerActivities.push({
                                                id: container.containerActivities.length.toString(),
                                                containerId: "1",
                                                type: ContainerActivityType.STOPPED,
                                                message: '1.5',
                                                createdAt: new Date(),
                                                updatedAt: new Date(),
                                            });
                                            setOpenStop(false);
                                            setLoadingStop(false);

                                            toast({
                                                title: stopT('success.title'),
                                                description: stopT('success.description', { name: container.name }),
                                            })
                                        }, 250);
                                    }}>{stopT('actions.stop')}</Button>
                                }
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={openRestart} onOpenChange={setOpenRestart}>
                        <DialogTrigger asChild>
                            <Button disabled={container.state !== ContainerState.RUNNING}>{restartT('actions.restart')}</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{restartT('title', { name: container.name })}</DialogTitle>
                                <DialogDescription>{restartT('description', { name: container.name })}</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant={"outline"}>{restartT('actions.cancel')}</Button>
                                </DialogClose>
                                {loadingRestart
                                    ? <Button disabled><Loader2 className="animate-spin" /> {restartT('actions.restarting')}</Button>
                                    : <Button onClick={() => {
                                        setLoadingRestart(true);

                                        setTimeout(() => {
                                            container.state = ContainerState.RUNNING;
                                            container.containerActivities.push({
                                                id: container.containerActivities.length.toString(),
                                                containerId: "1",
                                                type: ContainerActivityType.RESTARTED,
                                                message: '1.5',
                                                createdAt: new Date(),
                                                updatedAt: new Date(),
                                            });
                                            setOpenRestart(false);
                                            setLoadingRestart(false);

                                            toast({
                                                title: restartT('success.title'),
                                                description: restartT('success.description', { name: container.name }),
                                            })
                                        }, 250);
                                    }}>{restartT('actions.restart')}</Button>
                                }
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    )
}