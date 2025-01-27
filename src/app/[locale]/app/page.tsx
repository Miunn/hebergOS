import getMe from "@/actions/user"
import { getServerSession } from "next-auth"

export default async function Dashboard() {
    
    const me = getMe();
    
    return (
        <main className="flex items-center justify-center md:h-screen">
            
        </main>
    )
}