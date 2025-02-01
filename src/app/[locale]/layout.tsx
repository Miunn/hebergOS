import { NextIntlClientProvider } from 'next-intl';
import type { Metadata, Viewport } from "next";
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
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';

export const metadata: Metadata = {
  title: "HebergOS",
  description: "Fast way to host projects",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
}

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

  return (
    <html lang={(await props.params).locale}>
      <body
        className={`${roboto.className} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Header />
            {children}
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
