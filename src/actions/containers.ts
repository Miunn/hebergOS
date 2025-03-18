'use server'

import { apiEditCpuLimit, apiEditMemoryLimit } from "@/lib/apiService";
import { ChangeDomainFormSchema, ClientContainerStat, ContainerWithActivity, ContainerWithNotificationsAndUsers, ContainerWithUsers, CreateContainerFormSchema, EditCpuLimitContainerFormSchema, EditMemoryLimitContainerFormSchema, LinkUsersFormSchema } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { authConfig, isAdmin } from "@/lib/utils";
import { Container, ContainerActivityType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

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

export async function getContainerFull(id: string): Promise<ContainerWithActivity & ContainerWithUsers & ContainerWithNotificationsAndUsers | null> {
    const session = await getServerSession(authConfig);

    if (!session) {
        return null;
    }

    const container = await prisma.container.findUnique({
        where: { id: id },
        include: {
            users: true,
            containerActivities: true,
            containerNotifications: {
                include: { 
                    user: true
                }
            }
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

    const clientStats: ClientContainerStat[] = [];
    for (const [timestamp, stat] of Object.entries(stats) as [string, { memory: { used: number, limit: number}, cpu: { usage_percent: number, limit: number }, net: { up: number, down: number, delta_up: number, delta_down: number } }][]) {
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

export async function createContainer(data: { name: string, hostPort: number, memory: number, cpu: number }): Promise<boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    const parsed = CreateContainerFormSchema.safeParse(data);

    if (!parsed.success) {
        return false;
    }

    const parsedData = parsed.data;

    try {
        const r = await fetch(process.env.API_URL + "/container", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: parsedData.name,
                host_port_root: parsedData.hostPort,
                memory: parsedData.memory,
                cpulimit: parsedData.cpu,
            })
        });

        if (!r.ok) {
            return false;
        }

        const json = await r.json();

        await prisma.container.create({
            data: {
                id: json.Id,
                name: parsedData.name,
                hostPort: parsedData.hostPort,
                memory: parsedData.memory,
                cpu: parsedData.cpu,
            }
        });

        await prisma.containerActivity.create({
            data: {
                container: { connect: { id: json.Id } },
                type: ContainerActivityType.CREATED,
                message: "",
            }
        })

        revalidatePath("/app/administration");
        return true;
    } catch (e) {
        console.log(`Error creating container: ${e}`);
        return false;
    }
}

export async function linkUsers(containerId: string, data: { users: string[] }): Promise<boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    const container = await prisma.container.findUnique({
        where: { id: containerId },
        include: { users: { select: { id: true } } }
    });

    if (!container) {
        return false;
    }

    const parsedData = LinkUsersFormSchema.safeParse(data);

    if (!parsedData.success) {
        return false;
    }

    try {
        await prisma.container.update({
            where: { id: containerId },
            data: {
                users: {
                    set: parsedData.data.users.map(id => ({ id }))
                }
            }
        });

        revalidatePath("/app/administration");
        return true;
    } catch (e) {
        console.log(`Error linking users to container: ${e}`);
        return false;
    }
}

export async function changeContainerDomain(containerId: string, data: { domain: string}): Promise<boolean> {
    const session = await getServerSession(authConfig);

    if (!session) {
        return false;
    }

    const container = await prisma.container.findUnique({
        where: { id: containerId },
        include: { users: { select: { id: true } } }
    });

    if (!container) {
        return false;
    }

    if (!(await isAdmin() || container.users.some((user) => user.id === session.user.id))) {
        return false;
    }

    const parsedDomain = ChangeDomainFormSchema.safeParse(data);

    if (!parsedDomain.success) {
        return false;
    }

    try {
        await prisma.container.update({
            where: { id: containerId },
            data: { domain: parsedDomain.data.domain }
        });

        await prisma.containerActivity.create({
            data: {
                container: {
                    connect: { id: containerId }
                },
                type: ContainerActivityType.DOMAIN_UPDATE,
                message: parsedDomain.data.domain
            }
        })

        revalidatePath(`/app/containers/${containerId}`);
        return true;
    } catch (e) {
        console.log(`Error updating container domain: ${e}`);
        return false;
    }
}

export async function startContainer(containerId: string): Promise<boolean> {
    const session = await getServerSession(authConfig);

    if (!session) {
        return false;
    }

    const container = await prisma.container.findUnique({
        where: { id: containerId },
        include: { users: { select: { id: true } } }
    });

    if (!container) {
        return false;
    }

    if (!(await isAdmin() || container.users.some((user) => user.id === session.user.id))) {
        return false;
    }

    const r = await fetch(process.env.API_URL + `/container/start?id=${containerId}`, {
        method: "POST"
    });

    if (r.ok) {

        await prisma.containerActivity.create({
            data: {
                container: {
                    connect: { id: containerId }
                },
                type: ContainerActivityType.STARTED,
                message: ""
            }
        })
        
        return true;
    }

    return false;
}

export async function stopContainer(containerId: string): Promise<boolean> {
    const session = await getServerSession(authConfig);

    if (!session) {
        return false;
    }

    const container = await prisma.container.findUnique({
        where: { id: containerId },
        include: { users: { select: { id: true } } }
    });

    if (!container) {
        return false;
    }

    if (!(await isAdmin() || container.users.some((user) => user.id === session.user.id))) {
        return false;
    }

    const r = await fetch(process.env.API_URL + `/container/stop?id=${containerId}`, {
        method: "POST"
    });

    if (r.ok) {

        await prisma.containerActivity.create({
            data: {
                container: {
                    connect: { id: containerId }
                },
                type: ContainerActivityType.STOPPED,
                message: ""
            }
        })

        return true;
    }

    return false;
}

export async function restartContainer(containerId: string): Promise<boolean> {
    const session = await getServerSession(authConfig);

    if (!session) {
        return false;
    }

    const container = await prisma.container.findUnique({
        where: { id: containerId },
        include: { users: { select: { id: true } } }
    });

    if (!container) {
        return false;
    }

    if (!(await isAdmin() || container.users.some((user) => user.id === session.user.id))) {
        return false;
    }

    const r = await fetch(process.env.API_URL + `/container/restart?id=${containerId}`, {
        method: "POST"
    });

    if (r.ok) {

        await prisma.containerActivity.create({
            data: {
                container: {
                    connect: { id: containerId }
                },
                type: ContainerActivityType.RESTARTED,
                message: ""
            }
        })

        return true;
    }

    return false;
}

export async function getContainersAdmin(): Promise<Container[]> {
    if (!(await isAdmin())) {
        return [];
    }

    try {
        return await prisma.container.findMany();
    } catch {
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
    } catch {
        return []
    }
}

export async function editAdminMemoryLimit(containerId: string, data: { memory: number }): Promise<boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    const parsed =  EditMemoryLimitContainerFormSchema.safeParse(data);

    if (!parsed.success) {
        return false;
    }

    const parsedData = parsed.data;

    try {
        const apiR = await apiEditMemoryLimit(containerId, parsedData.memory);

        if (!apiR) {
            return false;
        }

        await prisma.container.update({
            where: { id: containerId },
            data: {
                memory: parsedData.memory
            }
        });

        await prisma.containerActivity.create({
            data: {
                container: {
                    connect: { id: containerId }
                },
                type: ContainerActivityType.MEMORY_UPDATE,
                message: `${parsedData.memory}`
            }
        })

        revalidatePath("/app/administration");
        revalidatePath(`/app/containers/${containerId}`);
        return true;
    } catch (e) {
        console.log(`Error updating container memory limit: ${e}`);
        return false;
    }
}

export async function editAdminCpuLimit(containerId: string, data: { cpu: number }): Promise<boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    const parsed = EditCpuLimitContainerFormSchema.safeParse(data);

    if (!parsed.success) {
        return false;
    }

    const parsedData = parsed.data;

    try {
        const apiR = await apiEditCpuLimit(containerId, parsedData.cpu);

        if (!apiR) {
            return false;
        }

        await prisma.container.update({
            where: { id: containerId },
            data: {
                cpu: parsedData.cpu
            }
        });

        await prisma.containerActivity.create({
            data: {
                container: {
                    connect: { id: containerId }
                },
                type: ContainerActivityType.CPU_UPDATE,
                message: `${parsedData.cpu}`
            }
        })

        revalidatePath("/app/administration");
        revalidatePath(`/app/containers/${containerId}`);
        return true;
    } catch (e) {
        console.log(`Error updating container CPU limit: ${e}`);
        return false;
    }
}

export async function deleteContainer(id: string): Promise<boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    const r = await fetch(process.env.API_URL + "/container?id=" + id, {
        method: "DELETE"
    });

    if (!r.ok) {
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

        revalidatePath("/app/administration");
        return true;
    } catch (e) {
        console.log(`Error deleting container: ${e}`);
        return false;
    }
}