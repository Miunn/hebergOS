import Caribou from "@/components/Caribou";
import ContactForm from "@/components/ContactForm";
import Header from "@/components/Header";
import { Building, Instagram, Mail } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function ContactUs() {

    const t = await getTranslations("pages.contact");
    const locale = await getLocale();

    return (
        <>
            <Header locale={locale} />
            <main className="min-h-screen mx-auto grid grid-cols-1 grid-rows-[1fr_auto_1fr] md:grid-cols-[1fr_auto_1fr] md:grid-rows-1 md:gap-8">
                <div className="relative h-full overflow-hidden">
                    <div className="mt-32 md:mt-64 max-w-lg mx-auto px-3 md:px-0 z-40">
                        <h1 className="text-2xl md:text-4xl font-semibold tracking-wide leading-relaxed z-40">{t('title')}</h1>
                        <p className="text-md md:text-xl">{t('description')}</p>

                        <div className="mt-11 space-y-6 text-sm md:text-base">
                            <p className="flex gap-2 z-40">
                                <Building className="text-secondary" /> <span dangerouslySetInnerHTML={{ __html: t('contact.address') }} />
                            </p>
                            <p className="flex gap-2 z-40">
                                <Instagram className="text-secondary" /> <Link href={t('contact.instagram.link')} target="_blank" className="z-40">{t('contact.instagram.label')}</Link>
                            </p>
                            <p className="flex gap-2 z-40">
                                <Mail className="text-secondary" /> <Link href={t('contact.mail.link')} target="_blank" className="z-40">{t('contact.mail.label')}</Link>
                            </p>
                        </div>
                    </div>
                    <Caribou className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[0.3rem] md:text-[0.5rem] opacity-40" />
                </div>

                <div className="w-full md:w-0 md:h-full border-b md:border-b-0 md:border-r" />

                <ContactForm className="mt-8 mb-16 md:mb-0 md:mt-64 px-3 md:px-0 max-w-xl w-full mx-auto" />
            </main>
        </>
    )
}