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
            memoryLimit: stat.memory.limit,
            cpu: stat.cpu.usage_percent,
            cpuLimit: stat.cpu.limit,
            netUp: stat.net.up,
            netDown: stat.net.down,
            netDeltaUp: stat.net.delta_up,
            netDeltaDown: stat.net.delta_down
        });
    }
    clientStats.sort((a, b) => a.timestamp - b.timestamp);

    console.log("First", clientStats[0]);
    console.log("Last", clientStats[clientStats.length - 1]);

    // Sync limits according to last stat
    await prisma.container.update({
        where: {
            id: containerId
        },
        data: {
            memory: clientStats[clientStats.length - 1].memoryLimit,
            cpu: clientStats[clientStats.length - 1].cpuLimit
        }
    })

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

export async function getAvailableHostPorts(): Promise<number[]> {
    if (!(await isAdmin())) {
        return [];
    }

    const basePorts = [0, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000]

    try {
        return await prisma.container.findMany({
            select: {
                hostPort: true
            }
        }).then(containers => basePorts.filter(port => !containers.some(container => container.hostPort === port)));
    } catch (e) {
        return []
    }
}

export async function deleteContainer(id: string): Promise<boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    try {
        await prisma.container.update({
            where: { id: id },
            data: {
                users: {
                    set: []
                }
            }
        })
        await prisma.container.delete({
            where: { id: id },
            
        });
        return true;
    } catch (e) {
        console.log(`Error deleting container: ${e}`);
        return false;
    }
}