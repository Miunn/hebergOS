import { getContainerFull } from "@/actions/containers"
import ContainerTabs from "@/components/containers/ContainerTabs";
import { robotoMono } from "@/ui/fonts";

export default async function Container({ params }: { params: Promise<{ locale: string, container: string }> }) {

    const container = (await getContainerFull((await params).container))!;

    return (
        <>
            <div className="mb-8">
                <h1 className={`${robotoMono.className} antialiased text-xl mb-4`}>/{container?.name}</h1>
                <p className={`${robotoMono.className} antialiased`}>{container?.domain}</p>
                <p>Exited</p>
            </div>

            <ContainerTabs container={container} />
        </>
    )
}