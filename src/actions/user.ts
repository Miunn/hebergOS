'use server'

import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { LinkContainersFormSchema, RegisterFormSchema, UserWithContainers } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/utils";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import bcrypt from 'bcryptjs';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";

export async function getMe(): Promise<UserWithContainers | null> {
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

export async function getUsers(): Promise<UserWithContainers[]> {
    if (!(await isAdmin())) {
        return [];
    }

    const users = await prisma.user.findMany({
        include: {
            containers: true
        }
    })

    return users;
}

export async function createUser(data: { name: string, email: string, nickname: string, password: string, passwordConfirmation: string, roles: Role[] }): Promise<{ error?: string }> {
    if (!(await isAdmin())) {
        return { error: 'not-authorized' };
    }

    console.log("Creating user with data : ", data);
    const parsedData = RegisterFormSchema.safeParse(data);

    if (!parsedData.success) {
        return { error: 'invalid-data' };
    }

    const { name, email, nickname, password, roles } = parsedData.data;

    try {
        const hashedPassword = await bcrypt.hash(password, 13);

        await prisma.user.create({
            data: {
                name: name,
                email: email,
                nickname: nickname,
                password: hashedPassword,
                roles
            }
        });

        return { error: undefined };
    } catch (error) {

        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return { error: 'nickname-already-exists' };
            }
        }

        return { error: 'unknown-error' };
    }
}

export async function linkContainers(userId: string, containers: { containers: string[] }): Promise<boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    const parsedContainersIds = LinkContainersFormSchema.safeParse(containers);

    if (!parsedContainersIds.success) {
        return false;
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                containers: {
                    set: parsedContainersIds.data.containers.map(c => ({ id: c }))
                }
            }
        });

        revalidatePath("/app/administration");
        return true;
    } catch (e) {
        console.log(`Error linking containers to user: ${e}`);
        return false;
    }
}

export async function editRoles(userId: string, roles: { roles: Role[] }): Promise<boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                roles: {
                    set: roles.roles
                }
            }
        });

        // Invalidate current user session
        await prisma.session.deleteMany({
            where: {
                userId: userId
            }
        });

        revalidatePath("/app/administration");
        return true;
    } catch (e) {
        console.log(`Error editing roles of user: ${e}`);
        return false;
    }
}