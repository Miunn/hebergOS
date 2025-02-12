import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { Role, User } from '@prisma/client';
import { SignInFormSchema, UserLight, UserWithContainers } from '@/lib/definitions';
import { clsx, type ClassValue } from "clsx"
import { getServerSession } from "next-auth";
import { twMerge } from "tailwind-merge"
import { prisma } from "./prisma";
import { ContainerState } from "@prisma/client";

export const authConfig: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'hello@exemple.com'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const parsedCredentials = SignInFormSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { nickname, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({ where: { nickname }, include: { userRoles: true }, omit: { password: false } });

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) return null;

        return { id: user.id, email: user.email, name: user.name, roles: user.userRoles.map((r) => r.role) };
      },
    })
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          roles: token.roles
        }
      }
    },
    jwt: ({ token, user }) => {
      // Means they just logged in
      if (user) {
        console.log("Just logged in user", user);
        const u = user as unknown as { id: string, email: string, name: string, roles: string[] };
        return {
          ...token,
          id: u.id,
          roles: u.roles
        }
      }
      return token;
    }
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function isAdmin() {
  const session = await getServerSession(authConfig);

  if (!session) {
    return false;
  }

  return session.user.roles.includes(Role.ADMIN);
}

export async function canAccessContainer(containerId: string) {
  const session = await getServerSession(authConfig);

  if (!session) {
    return false;
  }

  let user: UserWithContainers | null = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { containers: true, userRoles: true }
    });
  } catch (e) {
    return false;
  }

  if (!user) {
    return false;
  }

  if (user.userRoles.map(r => r.role).includes(Role.ADMIN) || user?.containers.some(c => c.id === containerId)) {
    return true;
  }

  return false;
}

export async function syncContainers() {
  const session = await getServerSession(authConfig);

  if (!session) {
    return false;
  }

  const r = await fetch(process.env.API_URL + "/container");

  if (!r.ok) {
    return false;
  }

  const containers = (await r.json())["success"];

  if (!containers) {
    return false;
  }

  for (const [id, value] of Object.entries(containers) as [string, { dockerlink: string, host_port_root: string, name: string, ports: { [key: string]: string }[], state: string, started_at?: number, exit_code?: number }][]) {
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

      case "exited":
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
        startedAt: state == "RUNNING" ? new Date(value.started_at! * 1000) : undefined,
        state: state,
      },
      create: {
        id: id,
        name: value.name,
        hostPort: parseInt(value.host_port_root) || 0,
        startedAt: state == "RUNNING" ? new Date(value.started_at!) : undefined,
        state: state,
      }
    })
  }

}