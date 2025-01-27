import { Prisma } from "@prisma/client";
import { z } from "zod";

export const SignInFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .trim(),
});

const userLight = Prisma.validator<Prisma.UserDefaultArgs>()({
    select: { id: true, name: true, email: true, roles: true, createdAt: true, updatedAt: true }
})

export type UserLight = Prisma.UserGetPayload<typeof userLight>

const userWithContainers = Prisma.validator<Prisma.UserDefaultArgs>()({
    select: { id: true, name: true, email: true, roles: true, createdAt: true, updatedAt: true },
    include: { containers: true },
    omit: { password: true }
})

export type UserWithContainers = Prisma.UserGetPayload<typeof userWithContainers>

const containerWithActivity = Prisma.validator<Prisma.ContainerDefaultArgs>()({
    include: { containerActivities: true }
})

export type ContainerWithActivity = Prisma.ContainerGetPayload<typeof containerWithActivity>

const containerWithUsers = Prisma.validator<Prisma.ContainerDefaultArgs>()({
    include: { users: { omit: { password: true }} },
})

export type ContainerWithUsers = Prisma.ContainerGetPayload<typeof containerWithUsers>

const containerWithNotifications = Prisma.validator<Prisma.ContainerDefaultArgs>()({
    include: { containerNotifications: true }
})

export type ContainerWithNotifications = Prisma.ContainerGetPayload<typeof containerWithNotifications>