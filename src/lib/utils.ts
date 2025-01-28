import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { clsx, type ClassValue } from "clsx"
import { getServerSession } from "next-auth";
import { twMerge } from "tailwind-merge"
import { prisma } from "./prisma";
import { ContainerState } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function isAdmin() {
  const session = await getServerSession(authConfig);

  if (!session) {
    return false;
  }

  return session.user.roles.includes("ADMIN");
}

export async function syncContainers() {
  const session = await getServerSession(authConfig);

  if (!session) {
    return false;
  }

  const containers = (await (await fetch(process.env.API_URL + "/container")).json())["success"];

  if (!containers) {
    return false;
  }

  for (const [id, value] of Object.entries(containers) as [string, any][]) {
    let state;

    switch (value.state) {
      case "running":
        state = ContainerState.RUNNING;
        break;

      case "created":
        state = ContainerState.CREATED;
        break;

      case "paused":
        state = ContainerState.PAUSED;
        break;

      case "restarting":
        state = ContainerState.RESTARTING;
        break;

      case "stopped":
        state = ContainerState.STOPPED;
        break;

      default:
        state = ContainerState.CREATED;
        break;
    }

    await prisma.container.upsert({
      where: { id: id },
      update: {
        name: value.name,
        hostPort: parseInt(value.host_port_root) || 0,
        startedAt: state == "RUNNING" ? new Date(value.started_at) : undefined,
        state: state,
      },
      create: {
        id: id,
        name: value.name,
        hostPort: parseInt(value.host_port_root) || 0,
        startedAt: state == "RUNNING" ? new Date(value.started_at) : undefined,
        state: state,
      }
    })
  }

}