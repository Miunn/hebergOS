export default async function AppLayout(
    { children, params }: Readonly<{
        children: React.ReactNode;
        params: { locale: string };
    }>
) {
    return (
        <main className="max-w-7xl mx-auto mt-14 px-24 md:h-screen">
            {children}
        </main>
    );
}
