'use server'

import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { CreateTicketFormSchema } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { NotificationState, NotificationType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createTicket(containerId: string, data: { type: NotificationType, message: string }): Promise<boolean> {
    const session = await getServerSession(authConfig);

    if (!session) {
        return false;
    }

    const parsedData = CreateTicketFormSchema.safeParse(data);

    if (!parsedData.success) {
        return false;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { containers: true }
    });

    if (!user || !user.containers.map(c => c.id).includes(containerId)) {
        return false;
    }

    try {
        await prisma.notification.create({
            data: {
                type: parsedData.data.type,
                message: parsedData.data.message,
                user: {
                    connect: { id: user.id }
                },
                container: {
                    connect: { id: containerId }
                }
            }
        })

        revalidatePath(`/app/containers/${containerId}`);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function cancelTicket(ticketId: string): Promise<boolean> {
    const session = await getServerSession(authConfig);

    if (!session) {
        return false;
    }

    const ticket = await prisma.notification.findUnique({
        where: { id: ticketId },
        include: { user: true, container: true }
    });

    if (!ticket) {
        return false;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { containers: true }
    });

    if (!user ||! user.containers.map(c => c.id).includes(ticket.containerId)) {
        return false;
    }

    try {
        await prisma.notification.update({
            where: { id: ticketId },
            data: {
                state: NotificationState.CANCELED
            }
        })

        revalidatePath(`/app/containers/${ticket.containerId}`);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}