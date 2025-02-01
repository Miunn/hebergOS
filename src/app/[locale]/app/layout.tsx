import { syncContainers } from "@/lib/utils";

export default async function AppLayout(
    { children, params }: Readonly<{
        children: React.ReactNode;
        params: { locale: string };
    }>
) {
    await syncContainers();

    return (
        <main className="max-w-7xl mx-auto mt-14 px-24 md:min-h-screen">
            {children}
        </main>
    );
}
