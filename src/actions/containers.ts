'use server'

import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { ClientContainerStat, ContainerWithActivity, ContainerWithNotifications, ContainerWithUsers } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/utils";
import { Container } from "@prisma/client";
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

export async function getContainerFull(id: string): Promise<ContainerWithActivity & ContainerWithUsers & ContainerWithNotifications | null> {
    const session = await getServerSession(authConfig);

    if (!session) {
        return null;
    }

    const container = await prisma.container.findUnique({
        where: { id: id },
        include: {
            users: true,
            containerActivities: true,
            containerNotifications: true
        }
    });

    if (!container) {
        return null;
    }

    if (await isAdmin() || container.users.some((user) => user.id === session.user.id)) {
        return container;
    }

    return null;
}

export async function getContainerStats(containerId: string, period: "hour" | "4hours" | "day" | "week"): Promise<ClientContainerStat[] | null> {
    const session = await getServerSession(authConfig);

    if (!session) {
        return null;
    }

    const container = await prisma.container.findUnique({
        where: { id: containerId },
        include: { users: { select: { id: true } } }
    });

    if (!container) {
        return null;
    }

    if (!(await isAdmin() || container.users.some((user) => user.id === session.user.id))) {
        return null;
    }

    const r = await fetch(process.env.API_URL + `/container/stats?id=${containerId}&since=0&scale=${period}`);

    if (!r.ok) {
        return null;
    }

    const stats = await r.json();

    let clientStats: ClientContainerStat[] = [];
    for (const [timestamp, stat] of Object.entries(stats) as [string, any][]) {
        clientStats.push({
            timestamp: parseInt(timestamp),
            memory: stat.memory.used,
            cpu: stat.cpu.usage_percent,
            netUp: stat.net.up,
            netDown: stat.net.down,
            netDeltaUp: stat.net.delta_up,
            netDeltaDown: stat.net.delta_down
        });
    }
    clientStats.sort((a, b) => a.timestamp - b.timestamp);

    console.log("First", clientStats[0]);
    console.log("Last", clientStats[clientStats.length - 1]);
    return clientStats;
}

export async function getContainersAdmin(): Promise<Container[]> {
    if (!(await isAdmin())) {
        return [];
    }

    try {
        return await prisma.container.findMany();
    } catch (e) {
        return []
    }
}