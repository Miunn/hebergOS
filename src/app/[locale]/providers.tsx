'use client'

import { Toaster } from '@/components/ui/toaster'
import { SessionProvider } from 'next-auth/react'

export const Providers = ({ children }: { children?: React.ReactNode }) => {
    return (
        <SessionProvider>
            {children}
            <Toaster />
        </SessionProvider>
    )
}