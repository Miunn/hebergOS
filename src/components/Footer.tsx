import { robotoMono } from "@/ui/fonts";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

export default async function Footer() {
    return (
        <footer className="2xl:px-96 sm:px-11 px-2 bg-primary text-primary-foreground flex flex-col gap-6 sm:gap-11 py-3 sm:py-8">
            <div className="w-full grid grid-cols-3">
                <div className="h-fit flex items-center gap-4 col-span-3 md:col-span-2">
                    <Image className="object-cover" src={"/favicon-white.png"} alt="HebergOS" width={64} height={64} />
                    <h1 className="text-xl">HebergOS</h1>
                </div>
                <div className="col-span-3 md:col-span-1 justify-self-end grid grid-cols-3 gap-12 md:gap-24">
                    <ul>
                        <p className="text-sm font-semibold text-gray-300">About</p>
                        <li>
                            <Button variant={"link"} className="p-0" asChild><Link href={"/contact-us"} className="text-white text-lg">Contact</Link></Button>
                        </li>
                    </ul>
                    <ul>
                        <p className="text-sm font-semibold text-gray-300">./insa.sh</p>
                        <li>
                            <Button variant={"link"} className="p-0" asChild><Link href={"https://www.instagram.com/clubinfoinsahdf/#"} target="_blank" className="text-white text-lg">Instagram</Link></Button>
                        </li>
                        <li>
                            <Button variant={"link"} className="p-0" asChild><Link href={"https://www.linkedin.com/company/insa-sh/"} target="_blank" className="text-white text-lg">LinkedIn</Link></Button>
                        </li>
                    </ul>
                    <ul>
                        <p className="text-sm font-semibold text-gray-300">More</p>
                        <li>
                            <Button variant={"link"} className="p-0" asChild><Link href={"https://github.com/Miunn/hebergOS"} target="_blank" className="text-white text-lg">Github</Link></Button>
                        </li>
                        <li>
                            <Button variant={"link"} className="p-0" asChild><Link href={"https://github.com/f7ed0/HebergOS-dockerlink/tree/d413a2cc1d5a7bb9b4863a240501aeaa90f762c8"} target="_blank" className="text-white text-lg">Dockerlink</Link></Button>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="w-full space-y-6">
                <div className="h-px rounded-xl bg-gray-300" />
                <div className="flex flex-col md:flex-row justify-between">
                    <p className="hidden md:block">Run your projects with ease</p>
                    <p className="text-sm">A solution by <span className={`${robotoMono.className}`}>./insa.sh</span></p>
                </div>
            </div>
        </footer>
    )
}