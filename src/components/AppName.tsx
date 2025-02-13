import { robotoMono } from "@/ui/fonts"
import Image from "next/image"

export default function AppName() {
    return (
        <>
        <p className="hidden md:block">
            <span className="text-secondary hidden">Heberg</span>
            <span className="text-primary">OS</span>
        </p>
        <div className="flex md:hidden justify-start items-center">
            <Image src="/favicon.png" alt="HebergOS" width={48} height={48} />

            {/* <h1 className={`${robotoMono.className} antialiased text-center text-xl text-primary`}>./insa.sh</h1> */}
        </div>
        </>
    )
}