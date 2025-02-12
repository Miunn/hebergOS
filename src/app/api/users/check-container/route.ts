import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    if (!request.nextUrl.searchParams.get("containerId")) {
        return new Response(null, { status: 400 });
    }

    const token = await getToken({ req: request });

    if (!token) {
        return new Response(null, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: token.id },
        include: { containers: true }
    });
        

    if (token.roles.includes(Role.ADMIN) || user?.containers.some(c => c.id === request.nextUrl.searchParams.get("containerId"))) {
        return new Response(JSON.stringify({ status: true }), { status: 200 });
    }

    return new Response(null, { status: 401 });
}