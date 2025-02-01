import { robotoMono } from "@/ui/fonts";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

export default async function Footer() {
    return (
        <footer className="2xl:px-96 px-11 bg-purple-600 text-white flex flex-col gap-4 py-11">
            <div className="w-full grid grid-cols-3 h-40">
                <div className="h-fit flex items-center gap-4 col-span-2">
                    <Image className="object-cover" src={"/favicon.png"} alt="HebergOS" width={64} height={64} />
                    <h1 className="text-xl">HebergOS</h1>
                </div>
                <div className="justify-self-end grid grid-cols-3 gap-24">
                    <ul>
                        <p className="text-sm font-semibold text-gray-300">About</p>
                        <li>
                            <Button variant={"link"} className="p-0" asChild><Link href={"/contact"} className="text-white text-lg">Contact</Link></Button>
                        </li>
                    </ul>
                    <ul>
                        <p className="text-sm font-semibold text-gray-300">./insa.sh</p>
                        <li>
                            <Button variant={"link"} className="p-0" asChild><Link href={"/contact"} className="text-white text-lg">Instagram</Link></Button>
                        </li>
                        <li>
                            <Button variant={"link"} className="p-0" asChild><Link href={"/contact"} className="text-white text-lg">LinkedIn</Link></Button>
                        </li>
                    </ul>
                    <ul>
                        <p className="text-sm font-semibold text-gray-300">More</p>
                        <li>
                            <Button variant={"link"} className="p-0" asChild><Link href={"/github"} className="text-white text-lg">Github</Link></Button>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="h-px rounded-xl bg-gray-300" />
            <div className="w-full flex justify-between">
                <p>Run your projects with ease</p>
                <p className="text-sm">A solution by <span className={`${robotoMono.className}`}>./insa.sh</span></p>
            </div>
        </footer>
    )
}