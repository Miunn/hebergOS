import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { isAdmin } from "@/lib/utils";

export async function POST(request: NextRequest) {
    if (!request.nextUrl.searchParams.get("containerId")) {
        return new Response(null, { status: 400 });
    }

    const body = await request.json();

    if (!body.user) {
        return new Response(null, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: body.user }, include: { containers: true } });

    if (!user) {
        return new Response(null, { status: 401 });
    }

    if ((await isAdmin()) || user.containers.map(c => c.id).includes(request.nextUrl.searchParams.get("containerId")!)) {
        return new Response(JSON.stringify({ status: true }), { status: 200 });
    }

    return new Response(null, { status: 401 });
}