import { cn } from "@/lib/utils";
import { robotoMono } from "@/ui/fonts";
import { ContainerState } from "@prisma/client";
import Link from "next/link";

export default function Container({ className, id, name, state }: { className?: string, id?: string, name: string, state: ContainerState }) {
    
    const getStateColor = (state: ContainerState) => {
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
        <Link href={id ? `/app/containers/${id}` : '#'} className={cn("flex flex-col justify-around w-52 md:w-60 h-24 border rounded-2xl p-4 transition-all duration-200 cursor-pointer bg-white hover:bg-gray-100 hover:shadow-md hover:translate-x-[2px] hover:translate-y-[-3px]", className)}>
            <h2 className={`${robotoMono.className} antialiased truncate text-lg`}>{name}</h2>

            <div className="flex items-center gap-2 capitalize">
                <div className={`w-4 h-4 ${getStateColor(state)} rounded-full`} />
                <p>{state.toLocaleLowerCase()}</p>
            </div>
        </Link>
    )
}