import { NextIntlClientProvider } from 'next-intl';
import type { Metadata } from "next";
import "../globals.css";
import { roboto, robotoMono } from "../../ui/fonts";
import { Providers } from "./providers";
import { getMessages } from "next-intl/server";
import { Link, routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Github, LogIn, MessageSquareMore } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authConfig } from '../api/auth/[...nextauth]/route';

export const metadata: Metadata = {
  title: "HebergOS",
  description: "Fast way to host projects",
};

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
  }>
) {
  const {
    children
  } = props;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes((await props.params).locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const session = await getServerSession(authConfig);
  console.log("Session", session);

  return (
    (<html lang={(await props.params).locale}>
      <body
        className={`${roboto.className} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <header className="grid grid-cols-3 h-20 items-center px-4 bg-purple-600 text-white">
              <h1 className="font-bold text-xl">HebergOS</h1>
              <h1 className={`${robotoMono.className} antialiased text-center text-xl`}>./insa.sh</h1>
              <div className="flex justify-end items-center gap-4 text-xl">
                {session?.user.roles.includes("ADMIN")
                  ? <Button variant={"link"} asChild><Link href={"/app/admin"} className="text-white text-lg"><MessageSquareMore className="w-6 h-6" /> Administration</Link></Button>
                  : null
                }
                {session?.user
                  ? <p>{session.user.name}</p>
                  : <>
                    <Button variant={"link"} asChild><Link href={"/contact"} className="text-white text-lg"><MessageSquareMore className="w-6 h-6" /> Contactez-nous</Link></Button>
                    <Button variant={"link"} asChild><Link href={"/login"} className="text-white text-lg"><LogIn className="w-6 h-6" /> Connexion</Link></Button>
                  </>
                }
                <Button variant={"link"} asChild><Link href={"/github"} className="text-white text-lg"><Github className="w-6 h-6" /> Github</Link></Button>
              </div>
            </header>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>)
  );
}
