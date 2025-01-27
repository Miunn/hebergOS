import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { clsx, type ClassValue } from "clsx"
import { getServerSession } from "next-auth";
import { twMerge } from "tailwind-merge"

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