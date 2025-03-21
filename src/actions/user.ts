'use server'

import { ChangeMailFormSchema, ChangeNicknameFormSchema, ChangePasswordFormSchema, LinkContainersFormSchema, RegisterFormSchema, UserWithContainers } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { authConfig, isAdmin } from "@/lib/utils";
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
            containers: true,
            userRoles: true
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
            containers: true,
            userRoles: true
        }
    })

    return users;
}

export async function createUser(data: { name: string, email: string, nickname: string, password: string, passwordConfirmation: string, roles: Role[] }): Promise<{ error?: string }> {
    if (!(await isAdmin())) {
        return { error: 'not-authorized' };
    }

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
                userRoles: {
                    create: roles.map(r => ({ role: r }))
                }
            }
        });

        revalidatePath("/app/administration");
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

export async function changeNickname(userId: string, data: { nickname: string }): Promise<boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    const parsedData = ChangeNicknameFormSchema.safeParse(data);

    if (!parsedData.success) {
        return false;
    }

    try {
        await prisma.user.update({
            data: {
                nickname: parsedData.data.nickname
            },
            where: { id: userId }
        });

        revalidatePath("/app/administration");
        return true;
    } catch {
        return false;
    }
}

export async function changeMail(userId: string, data: { email: string }): Promise<boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    const parsedData = ChangeMailFormSchema.safeParse(data);

    if (!parsedData.success) {
        return false;
    }

    try {
        await prisma.user.update({
            data: {
                email: parsedData.data.email
            },
            where: { id: userId }
        });

        revalidatePath("/app/administration");
        return true;
    } catch {
        return false;
    }
}

export async function changePassword(userId: string, data: { password: string, passwordConfirmation: string }): Promise<boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    const parsedData = ChangePasswordFormSchema.safeParse(data);

    if (!parsedData.success) {
        return false;
    }

    try {
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 13);

        await prisma.user.update({
            data: {
                password: hashedPassword
            },
            where: { id: userId }
        });

        return true;
    } catch {
        return false;
    }
}

export async function editRoles(userId: string, roles: { roles: Role[] }): Promise<boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    try {
        await prisma.userRole.deleteMany({
            where: {
                userId: userId
            }
        });
        await prisma.user.update({
            where: { id: userId },
            data: {
                userRoles: {
                    create: roles.roles.map(r => ({ role: r }))
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

export async function deleteUser(userId: string): Promise<boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                containers: { set: [] }
            }
        })
        await prisma.user.delete({
            where: { id: userId }
        });

        revalidatePath("/app/administration");
        return true;
    } catch (e) {
        console.log(`Error deleting user: ${e}`);
        return false;
    }
}