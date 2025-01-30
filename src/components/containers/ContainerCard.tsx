import { robotoMono } from "@/ui/fonts";
import { ContainerState } from "@prisma/client";
import Link from "next/link";

export default function Container({ id, name, state }: { id: string, name: string, state: ContainerState }) {

    const getStateColor = () => {
        switch (state) {
            case "CREATED":
                return "bg-blue-400";
            case "RUNNING":
                return "bg-green-400";
            case "PAUSED":
                return "bg-yellow-400";
            case "RESTARTING":
                return "bg-purple-400";
            case "STOPPED":
                return "bg-red-400";
            default:
                return "bg-gray-400";
        }
    }

    return (
        <Link href={`/app/containers/${id}`} className="flex flex-col justify-around w-60 h-24 border rounded-2xl p-4 transition-all duration-200 cursor-pointer hover:bg-gray-100 hover:shadow-md hover:translate-x-[2px] hover:translate-y-[-3px]">
            <h2 className={`${robotoMono.className} antialiased truncate text-lg`}>{name}</h2>

            <div className="flex items-center gap-2 capitalize">
                <div className={`w-4 h-4 ${getStateColor()} rounded-full`} />
                <p>{state.toLocaleLowerCase()}</p>
            </div>
        </Link>
    )
}