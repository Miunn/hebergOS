import ContactForm from "@/components/ContactForm";
import { GridPattern } from "@/components/grid-pattern";
import Header from "@/components/Header";
import { InteractiveGridPattern } from "@/components/interactive-grid-pattern";
import { cn } from "@/lib/utils";
import { Building, Instagram, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function ContactUs() {

    const t = await getTranslations("pages.contact");

    return (
        <>
            <Header />
            <main className="min-h-screen mx-auto grid grid-cols-2 gap-16">
                <div className="relative h-full border-r [mask-image:linear-gradient(to_bottom_left,white,white,transparent)]">
                    <InteractiveGridPattern
                        squares={[10, 10]}
                        className={cn(
                            "",
                        )}
                        width={160}
                        height={160}
                        x={120}
                    />
                    <div className="mt-64 max-w-lg mx-auto">
                        <h1 className="text-4xl font-semibold tracking-wide leading-relaxed">{t('title')}</h1>
                        <p className="text-xl">{t('description')}</p>

                        <div className="mt-11 space-y-6">
                            <p className="flex gap-2 text-primary">
                                <Building className="text-secondary" /> <span dangerouslySetInnerHTML={{ __html: t('contact.address') }} />
                            </p>
                            <p className="flex gap-2 text-primary">
                                <Instagram className="text-secondary" /> <Link href={t('contact.instagram.link')} target="_blank">{t('contact.instagram.label')}</Link>
                            </p>
                            <p className="flex gap-2 text-primary">
                                <Mail className="text-secondary" /> <Link href={t('contact.mail.link')} target="_blank">{t('contact.mail.label')}</Link>
                            </p>
                        </div>
                    </div>
                </div>

                <ContactForm className="mt-64 max-w-xl w-full mx-auto" />
            </main>
        </>
    )
}