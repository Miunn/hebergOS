import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/utils";
import { getServerSession } from "next-auth";

export async function getContainer(id: string) {
    const session = await getServerSession(authConfig);

    if (!session) {
        return null;
    }

    const container = await prisma.container.findUnique({
        where: { id: id },
        include: { users: { select: { id: true } } }
    });

    if (!container) {
        return null;
    }

    if (await isAdmin() || container.users.some((user) => user.id === session.user.id)) {
        return container;
    }

    return null;
}

export async function getContainers() {
    
}