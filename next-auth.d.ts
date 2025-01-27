import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    export interface Session {
        user: {
            name: string
            email: string
            id: string
            roles: string[]
        } & DefaultSession;
    }

    export interface User extends DefaultUser {
        id: string;
        roles: string[];
    }
}

declare module "next-auth/jwt" {
    export interface JWT extends DefaultJWT {
        id: string;
        roles: string[];
    }
}