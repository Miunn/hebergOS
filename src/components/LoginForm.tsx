"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Input } from "./ui/input";
import { SignInFormSchema } from "@/lib/definitions";
import { signIn, useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

export default function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [loading, setLoading] = useState<boolean>(false);

    const session = useSession();
    const form = useForm({
        resolver: zodResolver(SignInFormSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data: { email: string; password: string; }) => {
        setLoading(true);
        const r = await signIn('credentials', { email: data.email, password: data.password, redirectUrl: '/dashboard', redirectTo: '/dashboard', redirect: true });
        if (r && r.error) {
            toast({
                title: "form.error.title",
                description: "form.error.message",
                variant: "destructive"
            });
        }

        setLoading(false);
    };

    return (
        <Card className={"w-96"}>
            <CardHeader>
                <CardTitle>{'title'}</CardTitle>
                <CardDescription>{'description'}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4"}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{'form.email'}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="exemple@mail.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between">
                                        <FormLabel>{'form.password'}</FormLabel>
                                        <Button variant={"link"} className="ml-auto p-0 h-fit focus-visible:ring-offset-2" asChild>
                                            <Link href={`/forgot-password`} className="">{'form.forgotPassword'}</Link>
                                        </Button>
                                    </div>
                                    <FormControl>
                                        <Input placeholder={"••••••••••"} type={"password"} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {loading
                            ? <Button className={"ml-auto mr-0 flex"} type="submit" disabled><Loader2 className="animate-spin mr-2" /> {'form.submitting'}</Button>
                            : <Button className={"block ml-auto mr-0"} type="submit"> {'form.submit'}</Button>
                        }
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
