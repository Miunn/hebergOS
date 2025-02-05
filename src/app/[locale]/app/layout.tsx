import Header from "@/components/Header";
import { syncContainers } from "@/lib/utils";

export default async function AppLayout(
    { children, params }: Readonly<{
        children: React.ReactNode;
        params: { locale: string };
    }>
) {
    await syncContainers();

    return (
        <>
            <Header />
            <main className="md:min-h-screen pt-14 bg-primary/4">
                <div className="max-w-7xl mx-auto px-24">
                    {children}
                </div>
            </main>
        </>
    );
}
