'use server'

import { ContactFormSchema } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";

export async function submitContactMessage(data: { name: string, email: string, message: string }) {

    const parsedData = ContactFormSchema.safeParse(data);

    console.log(parsedData);
    if (!parsedData.success) {
        return false;
    }

    try {
        await prisma.contact.create({
            data: {
                name: parsedData.data.name,
                email: parsedData.data.email,
                message: parsedData.data.message
            }
        });
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}