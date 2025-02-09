'use server'

import { ContactFormSchema } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/utils";
import { Contact } from "@prisma/client";

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

export async function deleteContactMessage(id: string): Promise<boolean> {
    if (!(await isAdmin())) {
        return false;
    }

    try {
        await prisma.contact.delete({
            where: { id: id }
        })
        return true;
    } catch {
        return false;
    }
}

export async function getContactMessages(): Promise<Contact[] | null> {
    if (!(await isAdmin())) {
        return [];
    }

    try {
        const messages = await prisma.contact.findMany();
        return messages;
    } catch {
        return null;
    }
}