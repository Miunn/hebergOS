import Caribou from "@/components/Caribou";
import ContactUs from "@/components/ContactUs";
import Header from "@/components/Header";
import DummyChart from "@/components/landing/DummyChart";
import { getTranslations } from "next-intl/server";

export default async function Home() {

  const t = await getTranslations('pages.home');


  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col gap-8 row-start-2 py-32 sm:items-start">

        <div className="flex flex-col items-center gap-11 mx-auto mb-64">
          <h1 className="text-5xl text-center text-primary self-center font-semibold leading-tight tracking-wide" dangerouslySetInnerHTML={{ __html: t('catchLine') }} />

          <p className="text-xl text-center self-center" dangerouslySetInnerHTML={{ __html: t('description') }} />

          <ContactUs />
        </div>

        <section className="max-w-[1300px] space-y-28 mx-auto">
          <section className="grid grid-cols-2 gap-28 mx-auto">
            <div>
              <Caribou className="text-[0.5px] font-thin" />
              <h2 className="text-4xl font-bold mb-6">{t('section1.title')}</h2>
              <p>{t('section1.description')}</p>
            </div>

            <div>
              <DummyChart />
            </div>
          </section>

          <section className="grid grid-cols-2 gap-28 mx-auto">
            <div>
              <DummyChart />
            </div>

            <div>
              <Caribou className="text-[0.5px] font-thin" />
              <h2 className="text-4xl font-bold mb-6">{t('section2.title')}</h2>
              <p>{t('section2.description')}</p>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-28 mx-auto">
            <div>
              <Caribou className="text-[0.5px] font-thin" />
              <h2 className="text-4xl font-bold mb-6">{t('section3.title')}</h2>
              <p>{t('section3.description')}</p>
            </div>

            <div>
              <DummyChart />
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
