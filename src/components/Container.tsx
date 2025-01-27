import { robotoMono } from "@/ui/fonts";
import Link from "next/link";

export default function Container({ id, name, state }: { id: string, name: string, state: string }) {
    return (
        <Link href={`/app/container/${id}`} className="flex flex-col justify-around w-72 h-28 border rounded-2xl p-4 transition-all duration-200 cursor-pointer hover:bg-gray-100 hover:shadow-md hover:translate-x-[2px] hover:translate-y-[-3px]">
            <h2 className={`${robotoMono.className} antialiased truncate text-lg`}>/{ name }</h2>

            <div className="w-5 h-5 bg-green-400 rounded-full"/>
        </Link>
    )
}