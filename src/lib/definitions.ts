import { Prisma, Role } from "@prisma/client";
import { z } from "zod";

export type ClientContainerStat = {
    timestamp: number;
    memory: number;
    memoryLimit: number;
    cpu: number;
    cpuLimit: number;
    netUp: number;
    netDown: number;
    netDeltaUp: number;
    netDeltaDown: number;
}

export const SignInFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .trim(),
});

export const RegisterFormSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }).trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    nickname: z.string().min(3, { message: 'Nickname must be at least 3 characters long.' }).trim(),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long.' })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character.' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase character.' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase character.' })
        .trim(),
    passwordConfirmation: z.string().trim(),
    roles: z.array(z.nativeEnum(Role)).default([Role.USER]),
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
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