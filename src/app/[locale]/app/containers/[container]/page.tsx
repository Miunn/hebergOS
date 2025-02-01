import { getContainerFull } from "@/actions/containers"
import ContainerTabs from "@/components/containers/ContainerTabs";
import { robotoMono } from "@/ui/fonts";
import { ContainerState } from "@prisma/client";

export default async function Container({ params }: { params: Promise<{ locale: string, container: string }> }) {

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
            <div className="mb-8">
                <h1 className={`${robotoMono.className} antialiased text-xl mb-4`}>{container?.name}</h1>
                <p className={`${robotoMono.className} antialiased`}>{container?.domain}</p>
                <p className="flex items-center gap-2 text-lg"><span className={`${getStateColor(container.state)} inline-block w-3 h-3 rounded-full`} /> Exited</p>
            </div>

            <ContainerTabs container={container} />
        </>
    )
}