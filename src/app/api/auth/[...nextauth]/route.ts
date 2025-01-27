import { prisma } from '@/lib/prisma';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

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
                const parsedCredentials = z
                  .object({ email: z.string().email(), password: z.string(), csrfToken: z.string() })
                  .safeParse(credentials);
          
                if (!parsedCredentials.success) {
                    return null;
                }

                const { email, password } = parsedCredentials.data;
                
                const user = await prisma.user.findUnique({ where: { email }, omit: { password: false } });

                if (!user) return null;

                const passwordsMatch = await bcrypt.compare(password, user.password);
        
                if (!passwordsMatch) return null;

                return { id: user.id, email: user.email, name: user.name, roles: user.roles };
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
                const u = user as unknown as User;
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

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };