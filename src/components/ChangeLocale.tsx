'use client'

import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTransition } from "react";

export default function ChangeLocale({ locale }: { locale: string }) {

    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const [isPending, startTransition] = useTransition();
    const handleChange = (newLocale: string) => {
        startTransition(() => {
            router.replace(
                // @ts-expect-error -- TypeScript will validate that only known `params`
                // are used in combination with a given `pathname`. Since the two will
                // always match for the current route, we can skip runtime checks.
                { pathname, params },
                { locale: newLocale }
            );;
        })
    }

    return (
        <>
            {
                locale === 'fr'
                    ? <Button variant={"outline"} onClick={() => handleChange("en")} size={"icon"} className="text-sm" disabled={isPending}>EN</Button>
                    : <Button variant={"outline"} onClick={() => handleChange("fr")} size={"icon"} className="text-sm" disabled={isPending}>FR</Button>
            }
        </>
    )
}