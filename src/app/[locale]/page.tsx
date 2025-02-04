import Caribou from "@/components/Caribou";
import ContactUs from "@/components/ContactUs";
import DummyChart from "@/components/landing/DummyChart";
import { getTranslations } from "next-intl/server";

export default async function Home() {

  const t = await getTranslations('pages.home');


  return (
    <>
      <main className="min-h-screen flex flex-col gap-8 row-start-2 py-32 sm:items-start">

        <div className="flex flex-col items-center gap-11 mx-auto mb-64">
          <h1 className="text-5xl text-center text-primary self-center font-semibold leading-tight tracking-wide" dangerouslySetInnerHTML={{ __html: t('catchLine') }} />

          <p className="text-xl text-center self-center" dangerouslySetInnerHTML={{ __html: t('description') }} />

          <ContactUs />
        </div>

        <section className="max-w-[1300px] grid grid-cols-2 gap-28 mx-auto">
          <div>
            <Caribou className="text-[0.5px] font-thin" />
            <h2 className="text-4xl font-bold mb-6">{t('monitor.title')}</h2>
            <p>{t('monitor.description')}</p>
          </div>

          <div>
            <DummyChart />
          </div>
        </section>
      </main>
    </>
  );
}
