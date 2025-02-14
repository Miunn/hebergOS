import { prisma } from "./prisma";
import { isAdmin } from "./utils";
import { EditCpuLimitContainerFormSchema, EditMemoryLimitContainerFormSchema } from "./definitions";

export async function apiEditMemoryLimit(containerId: string, newMemoryLimit: number): Promise<boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    const container = await prisma.container.findUnique({
        where: { id: containerId },
    });

    if (!container) {
        return false;
    }

    const parsed = EditMemoryLimitContainerFormSchema.safeParse({ memory: newMemoryLimit });

    if (!parsed.success) {
        return false;
    }

    const r = await fetch(`${process.env.API_URL}/container?id=${containerId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            memory: parsed.data.memory
        }),
    });

    if (r.ok) {
        return true;
    }

    return false;
}

export async function apiEditCpuLimit(containerId: string, newCpuLimit: number): Promise<boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    const container = await prisma.container.findUnique({
        where: { id: containerId },
    });

    if (!container) {
        return false;
    }

    const parsed = EditCpuLimitContainerFormSchema.safeParse({ memory: newCpuLimit });

    if (!parsed.success) {
        return false;
    }

    const r = await fetch(`${process.env.API_URL}/container?id=${containerId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            cpulimit: parsed.data.cpu
        }),
    });

    if (r.ok) {
        return true;
    }

    return false;
}