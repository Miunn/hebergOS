'use client'

import { Container } from "@prisma/client";
import { Terminal, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function ContainerShell({ container }: { container: Container }) {
    const widthRef = useRef<HTMLInputElement>(null);
    const heightRef = useRef<HTMLInputElement>(null);
    
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(450);

    const handleSizeChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setWidth(parseInt(widthRef.current!.value));
            setHeight(parseInt(heightRef.current!.value));
        }
    }

    return (
        <div className={`mx-auto flex flex-col gap-2 items-end`} style={{ width: width, height: height }}>
            <div className="w-fit flex gap-1 items-center">
                <Input ref={widthRef} type="number" defaultValue={width} onKeyDown={handleSizeChange} className="w-28" />
                <X />
                <Input ref={heightRef} type="number" defaultValue={height} onKeyDown={handleSizeChange} className="w-28" />
                <Button variant={"outline"} size={"icon"} asChild>
                    <Link href={`https://ssh.${container.name.replace('/', '')}.insash.org/wetty`} target="_blank"><Terminal /></Link>
                </Button>
            </div>
            <iframe className="mx-auto" src={`https://ssh.${container.name.replace('/', '')}.insash.org/wetty`} width={width} height={height} />
        </div>
    )
}