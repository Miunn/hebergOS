import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "../../auth/[...nextauth]/route";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    if (request.nextUrl.searchParams.get("containerId") === null) {
        return new Response(null, { status: 400 });
    }

    const session = await getServerSession(authConfig);

    const user = await prisma.user.findUnique({ where: { id: session?.user.id }, include: { containers: true } });

    if (!user) {
        return new Response(null, { status: 401 });
    }

    if (user.roles.includes("ADMIN") || user.containers.map(c => c.id).includes(request.nextUrl.searchParams.get("containerId")!)) {
        return new Response(JSON.stringify({ status: true }), { status: 200 });
    }

    return new Response(null, { status: 401 });
}