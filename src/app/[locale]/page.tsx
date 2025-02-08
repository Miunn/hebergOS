import Caribou from "@/components/Caribou";
import ContactUsCta from "@/components/ContactUsCta";
import ContainerActions from "@/components/containers/ContainerActions";
import ContainerCard from "@/components/containers/ContainerCard";
import Header from "@/components/Header";
import DummyChart from "@/components/landing/DummyChart";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BorderBeam } from "@/components/ui/border-beam";
import { Card } from "@/components/ui/card";
import { ContainerActivityType, ContainerState } from "@prisma/client";
import { getLocale, getTranslations } from "next-intl/server";
import { DotPattern } from "@/components/dot-pattern";
import { cn } from "@/lib/utils";

export default async function Home() {

  const t = await getTranslations('pages.home');
  const locale = await getLocale();

  return (
    <>
      <Header className="translate-y-[-1rem] opacity-0 animate-fade-in [--animation-delay:600ms]" />
      <main className="relative py-32">
        <DotPattern
          className={cn(
            "top-0 bottom-0 opacity-70 -z-10 [mask-image:linear-gradient(to_right,transparent,white,white,white,white,white,white,white,white,white,transparent)]",
          )}
        />

        <section className="max-w-[80rem] min-h-screen row-start-2 px-6 mx-auto sm:items-start">
        <section className="relative mx-auto mb-32 max-w-[80rem] px-6 text-center md:px-8">
          <h1 className="bg-gradient-to-br dark:from-white from-primary from-30% dark:to-white/40 to-primary/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-6xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]" dangerouslySetInnerHTML={{ __html: t('catchLine') }} />

          <p className="mb-12 text-lg tracking-tight text-gray-400 md:text-xl text-balance translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]" dangerouslySetInnerHTML={{ __html: t('description') }} />

          <ContactUsCta className="animate-fade-in opacity-0 [--animation-delay:400ms]" />

          <div className="relative mt-[8rem] animate-fade-up opacity-0 [--animation-delay:400ms] ">
            <div className="rounded-xl border border-white/10 bg-white bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-0 before:[filter:blur(180px)] before:[background-image:linear-gradient(to_bottom,var(--color-one),var(--color-one),transparent_40%)] before:animate-image-glow">
              <BorderBeam />

              <img src={`/landing/hero-${locale}.png`} alt="Hero" className="block relative w-full h-full rounded-[inherit] border object-contain" />
            </div>
          </div>
        </section>

        <section className="space-y-32 mx-auto animate-fade-in">
          <section className="grid grid-cols-[0.6fr_1fr] gap-20 mx-auto">
            <div>
              <Caribou className="text-[0.5px] font-thin" />
              <h2 className="text-4xl font-semibold mb-6">{t('section1.title')}</h2>
              <p>{t('section1.description')}</p>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="transform hover:-translate-y-2 transition-transform duration-200 -rotate-6">
                <ContainerCard name="web-app" state={ContainerState.RUNNING} />
              </div>
              <div className="transform hover:-translate-y-2 transition-transform duration-200 rotate-6">
                <ContainerCard name="plateformer" state={ContainerState.RUNNING} />
              </div>
              <div className="transform hover:-translate-y-2 transition-transform duration-200 -rotate-3">
                <ContainerCard name="api-service" state={ContainerState.CREATED} />
              </div>
              <div className="transform hover:-translate-y-2 transition-transform duration-200 -rotate-3">
                <ContainerCard name="database" state={ContainerState.STOPPED} />
              </div>
              <div className="transform hover:-translate-y-2 transition-transform duration-200 rotate-6">
                <ContainerCard name="cache-server" state={ContainerState.RUNNING} />
              </div>
              <div className="transform hover:-translate-y-2 transition-transform duration-200 -rotate-3">
                <ContainerCard name="message-queue" state={ContainerState.STOPPED} />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-[1fr_0.6fr] gap-20 mx-auto">
            <Card className="border border-gray-200 rounded-lg p-4">
              <ContainerActions container={{
                id: "1",
                name: '/mycontainer',
                domain: 'https://my-container.insash.org',
                state: ContainerState.RUNNING,
                hostPort: 10000,
                memory: 2,
                cpu: 50,
                containerActivities: [{
                  id: "1",
                  containerId: "1",
                  type: ContainerActivityType.MEMORY_UPDATE,
                  message: '1.5',
                  createdAt: new Date('2025-01-01'),
                  updatedAt: new Date('2025-01-01')
                }],
                createdAt: new Date('2025-01-01'),
                startedAt: new Date('2025-01-01'),
                updatedAt: new Date('2025-01-01')
              }} />
            </Card>

            <div>
              <Caribou className="text-[0.5px] font-thin" />
              <h2 className="text-4xl font-semibold mb-6">{t('section2.title')}</h2>
              <p>{t('section2.description')}</p>
            </div>
          </section>

          <section className="grid grid-cols-[0.6fr_1fr] gap-20 mx-auto">
            <div>
              <Caribou className="text-[0.5px] font-thin" />
              <h2 className="text-4xl font-semibold mb-6">{t('section3.title')}</h2>
              <p>{t('section3.description')}</p>
            </div>

            <div>
              <DummyChart />
            </div>
          </section>
        </section>

        <section className="max-w-[1300px] w-[700px] mx-auto space-y-14 mt-32">
          <h2 className="text-center text-4xl font-semibold">{t('faq.title')}</h2>

          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem
              value={"1"}
              className="rounded-lg border bg-background px-4 py-1"
            >
              <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
                {t('faq.questions.1.question')}
              </AccordionTrigger>
              <AccordionContent className="pb-2 text-muted-foreground">
                {t('faq.questions.1.answer')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value={"2"}
              className="rounded-lg border bg-background px-4 py-1"
            >
              <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
                {t('faq.questions.2.question')}
              </AccordionTrigger>
              <AccordionContent className="pb-2 text-muted-foreground">
                {t('faq.questions.2.answer')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value={"3"}
              className="rounded-lg border bg-background px-4 py-1"
            >
              <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
                {t('faq.questions.3.question')}
              </AccordionTrigger>
              <AccordionContent className="pb-2 text-muted-foreground">
                {t('faq.questions.3.answer')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value={"4"}
              className="rounded-lg border bg-background px-4 py-1"
            >
              <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
                {t('faq.questions.4.question')}
              </AccordionTrigger>
              <AccordionContent className="pb-2 text-muted-foreground">
                {t('faq.questions.4.answer')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        </section>
      </main>
    </>
  );
}
