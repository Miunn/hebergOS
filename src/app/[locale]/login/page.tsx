import Header from '@/components/Header';
import LoginForm from '@/components/LoginForm';
import { getLocale } from 'next-intl/server';
import { Suspense } from 'react';

export default async function LoginPage() {

  const locale = await getLocale();

  return (
    <>
      <Header locale={locale} />
      <main className="flex items-center justify-center h-screen">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </>
  );
}