import { getServerSession } from "next-auth"

export default async function Dashboard() {
    const session = await getServerSession();
    return (
        <main className="flex items-center justify-center md:h-screen">
            <pre>{JSON.stringify(session)}</pre>
        </main>
    )
}