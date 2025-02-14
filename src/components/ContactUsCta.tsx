import { getTranslations } from "next-intl/server";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default async function ContactUsCta({ variant, className }: { variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link", className?: string }) {

    const t = await getTranslations("pages.home");

    return (
        <Button variant={variant || "secondary"} className={className} asChild>
            <Link href={"/contact-us"} className="text-lg"><MessageCircle className="w-6 h-6" /> {t('contact')}</Link>
        </Button>
    )
}