import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { UserWithContainers } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function getMe(): Promise<UserWithContainers | null> {
    const session = await getServerSession(authConfig);

    if (!session) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id
        },
        include: {
            containers: true
        }
    });

    if (!user) {
        return null;
    }

    return user;
}