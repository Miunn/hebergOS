import { getContainerFull } from "@/actions/containers"
import ContainerTabs from "@/components/containers/ContainerTabs";
import ChangeDomain from "@/components/dialogs/containers/ChangeDomain";
import { Button } from "@/components/ui/button";
import { robotoMono } from "@/ui/fonts";
import { ContainerState } from "@prisma/client";
import { Bolt } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Container({ params }: { params: Promise<{ locale: string, container: string }> }) {

    const t = await getTranslations('pages.app.container');
    const container = (await getContainerFull((await params).container))!;

    const getStateColor = (state: ContainerState) => {
        switch (state) {
            case "CREATED":
                return "bg-blue-400";
            case "RUNNING":
                return "bg-green-400";
            case "PAUSED":
                return "bg-yellow-400";
            case "RESTARTING":
                return "bg-purple-400";
            case "STOPPED":
                return "bg-red-400";
            default:
                return "bg-gray-400";
        }
    }

    return (
        <>
            <div className="mb-8 space-y-2">
                <h1 className={`${robotoMono.className} antialiased text-xl`}>{container?.name}</h1>
                <div className={`${robotoMono.className} flex items-center gap-2`}>
                    {container.domain
                        ? <Link href={container.domain} target="_blank">{container.domain}</Link>
                        : <p className="italic">{t('noDomain')}</p>
                    }
                    <ChangeDomain container={container}>
                        <Button variant={"ghost"} size={"icon"}><Bolt /></Button>
                    </ChangeDomain>
                </div>
                <p className="flex items-center gap-2 capitalize"><span className={`${getStateColor(container.state)} inline-block w-3 h-3 rounded-full`} /> {container.state.toLowerCase()}</p>
            </div>

            <ContainerTabs container={container} />
        </>
    )
}