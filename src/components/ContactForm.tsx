'use client'

import { ContactFormSchema } from "@/lib/definitions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { useTranslations } from "next-intl"
import React from "react"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

export default function ContactForm({ className }: { className?: string }) {

    const t = useTranslations("pages.contact");
    const [loading, setLoading] = React.useState(false);

    const form = useForm<z.infer<typeof ContactFormSchema>>({
        resolver: zodResolver(ContactFormSchema),
        defaultValues: {
            name: '',
            email: '',
            message: ''
        }
    })

    const submit = async (data: z.infer<typeof ContactFormSchema>) => {
    }

    return (
        <Form {...form}>
            <form className={cn("space-y-4", className)} onSubmit={form.handleSubmit(submit)}>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('form.fields.name.label')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('form.fields.name.placeholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('form.fields.email.label')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('form.fields.email.placeholder')} {...field} />
                            </FormControl>
                            <FormDescription>{t('form.fields.email.description')}</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('form.fields.message.label')}</FormLabel>
                            <FormControl>
                                <Textarea className="h-32" placeholder={t('form.fields.message.placeholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {loading
                    ? <Button type="submit">{t('actions.submitting')}</Button>
                    : <Button disabled>{t('actions.submit')}</Button>
                }
            </form>
        </Form>
    )
}