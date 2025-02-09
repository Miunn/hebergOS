import { NextIntlClientProvider } from 'next-intl';
import type { Metadata, Viewport } from "next";
import "../globals.css";
import { roboto } from "../../ui/fonts";
import { Providers } from "./providers";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Footer from '@/components/Footer';

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
  if (!routing.locales.includes((await props.params).locale as "en" | "fr")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={(await props.params).locale}>
      <body
        className={`${roboto.className} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
