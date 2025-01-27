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
