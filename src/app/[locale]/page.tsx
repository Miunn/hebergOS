import { Button } from "@/components/ui/button";
import Link from "next/link";
import { robotoMono } from "../../ui/fonts";
import { Github, LogIn, MessageSquareMore } from "lucide-react";

export default async function Home() {
  return (
    <>
      <header className="grid grid-cols-3 h-20 items-center px-4 bg-purple-600 text-white">
        <h1 className="font-bold text-xl">HebergOS</h1>
        <h1 className={`${robotoMono.className} antialiased text-center text-xl`}>./insa.sh</h1>
        <div className="flex justify-end gap-4 text-xl">
          <Button variant={"link"} asChild><Link href={"/contact"} className="text-white text-lg"><MessageSquareMore className="w-6 h-6" /> Contactez-nous</Link></Button>
          <Button variant={"link"} asChild><Link href={"/login"} className="text-white text-lg"><LogIn className="w-6 h-6" /> Connexion</Link></Button>
          <Button variant={"link"} asChild><Link href={"/github"} className="text-white text-lg"><Github className="w-6 h-6" /> Github</Link></Button>
        </div>
      </header>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

        </footer>
      </div>
    </>
  );
}
