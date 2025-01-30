'use server'

import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { RegisterFormSchema, UserWithContainers } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/utils";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import bcrypt from 'bcryptjs';

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

export async function createUser(data: { name: string, email: string, nickname: string, password: string, passwordConfirmation: string, roles: Role[] }): Promise<Boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    const parsedData = RegisterFormSchema.safeParse(data);

    if (!parsedData.success) {
        return false;
    }

    const { name, email, nickname, password, roles } = parsedData.data;

    try {
        const hashedPassword = await bcrypt.hash(password, 13);
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                nickname: nickname,
                password: hashedPassword,
                roles
            }
        });

        return !!newUser;
    } catch (error) {
        console.log("Prisma error while creating user : ", error);
        return false;
    }
}