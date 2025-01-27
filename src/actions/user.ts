import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { UserLight } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function getMe(): Promise<UserLight | null> {
    const session = await getServerSession(authConfig);
    console.log("Session", session);

    if (!session) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id
        }
    });

    console.log("User", user);

    if (!user) {
        return null;
    }

    return user;
}