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
import { useTranslations } from "next-intl";

export default function LoginForm() {
    const t = useTranslations("components.auth.login");
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [loading, setLoading] = useState<boolean>(false);

    const session = useSession();
    const form = useForm({
        resolver: zodResolver(SignInFormSchema),
        defaultValues: {
            nickname: '',
            password: '',
        }
    });

    const onSubmit = async (data: { nickname: string; password: string; }) => {
        setLoading(true);
        const r = await signIn('credentials', { nickname: data.nickname, password: data.password, redirectUrl: '/app', redirectTo: '/app', redirect: true });
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
                <CardTitle>{t('title')}</CardTitle>
                <CardDescription>{t('description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4"}>
                        <FormField
                            control={form.control}
                            name="nickname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.fields.nickname.label')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('form.fields.nickname.placeholder')} {...field} />
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
                                        <FormLabel>{t('form.fields.password.label')}</FormLabel>
                                        <Button variant={"link"} className="ml-auto p-0 h-fit focus-visible:ring-offset-2" asChild>
                                            <Link href={`/forgot-password`} className="">{t('form.actions.forgotPassword')}</Link>
                                        </Button>
                                    </div>
                                    <FormControl>
                                        <Input placeholder={t('form.fields.password.placeholder')} type={"password"} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {loading
                            ? <Button className={"ml-auto mr-0 flex"} type="submit" disabled><Loader2 className="animate-spin mr-2" /> {t('form.actions.submitting')}</Button>
                            : <Button className={"block ml-auto mr-0"} type="submit"> {t('form.actions.submit')}</Button>
                        }
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
