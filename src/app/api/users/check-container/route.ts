import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { isAdmin } from "@/lib/utils";

export async function POST(request: NextRequest) {
    if (!request.nextUrl.searchParams.get("containerId")) {
        console.log("Container ID not found in query");
        return new Response(null, { status: 400 });
    }

    const body = await request.json();

    if (!body.user) {
        return new Response(null, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: body.user }, include: { containers: true } });

    if (!user) {
        console.log("User not found to authorize to container");
        return new Response(null, { status: 401 });
    }

    if ((await isAdmin()) || user.containers.map(c => c.id).includes(request.nextUrl.searchParams.get("containerId")!)) {
        console.log("Authorized to container");
        return new Response(JSON.stringify({ status: true }), { status: 200 });
    }

    console.log("Not authorized to container");
    return new Response(null, { status: 401 });
}