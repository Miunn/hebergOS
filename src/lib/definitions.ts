import { NotificationType, Prisma, Role } from "@prisma/client";
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
    nickname: z.string().trim(),
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

export const ContactFormSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }).trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    message: z.string().min(10, { message: 'Message must be at least 10 characters long.' }).max(1000, { message: 'Message must be less than 1000 characters long' }).trim(),
});

export const CreateTicketFormSchema = z.object({
    type: z.nativeEnum(NotificationType).default(NotificationType.CONTAINER_MEMORY),
    message: z.string().min(10, { message: 'Message must be at least 10 characters long.' }).max(1000, { message: 'Message must be less than 1000 characters long' }).trim(),
});

export const LinkContainersFormSchema = z.object({
    containers: z.array(z.string())
});

export const EditRolesFormSchema = z.object({
    roles: z.array(z.nativeEnum(Role)).default([Role.USER]),
});

export const CreateContainerFormSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }).trim(),
    hostPort: z.number({ coerce: true }).int().min(1024, { message: 'Host port must be at least 1024.' }),
    memory: z.number({ coerce: true }).min(0, { message: 'Memory must be at least 0 Go.' }),
    cpu: z.number({ coerce: true }).min(0, { message: 'CPU must be at least 0.' }),
})

export const ChangeDomainFormSchema = z.object({
    domain: z.string().min(3, { message: 'Domain must be at least 3 characters long.' }).trim().regex(/(http(s)?\:\/\/)?(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/, { message: 'Please enter a valid domain.' }),
})

export const EditMemoryLimitContainerFormSchema = z.object({
    memory: z.number({ coerce: true }).min(0, { message: 'Memory limit must be at least 0 Go.' }),
})

export const EditCpuLimitContainerFormSchema = z.object({
    cpu: z.number({ coerce: true }).min(0, { message: 'CPU limit must be at least 0%.' }),
})

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

const containerWithNotificationsAndUsers = Prisma.validator<Prisma.ContainerDefaultArgs>()({
    include: {
        containerNotifications: {
            include: { user: true }
        }
    }
})

export type ContainerWithNotificationsAndUsers = Prisma.ContainerGetPayload<typeof containerWithNotificationsAndUsers>

const notificationsWithUser = Prisma.validator<Prisma.NotificationDefaultArgs>()({
    include: { user: { omit: { password: true } } }
})

export type NotificationWithUser = Prisma.NotificationGetPayload<typeof notificationsWithUser>

const notificationWithUserAndContainer = Prisma.validator<Prisma.NotificationDefaultArgs>()({
    include: { user: { omit: { password: true } }, container: true }
})

export type NotificationWithUserAndContainer = Prisma.NotificationGetPayload<typeof notificationWithUserAndContainer>