import getMe from "@/actions/user"
import Container from "@/components/Container";
import { getTranslations } from "next-intl/server";
import { Fragment } from "react";

export default async function Dashboard() {

    const t = await getTranslations("pages.app.dashboard");
    const me = await getMe();

    return (
        <main className="max-w-7xl mx-auto px-24 md:h-screen">
            <h1 className="font-semibold text-3xl mt-14 mb-7">{t('title')}</h1>
            {me?.containers.map((container) => (
                <Fragment key={container.id}>
                    <Container id={container.id} name={container.name} state={"exited"} />
                </Fragment>
            ))}

            {me?.containers.length === 0
                ? <p className="text-center mt-32" dangerouslySetInnerHTML={{ __html: t('empty') }} />
                : null}
        </main>
    )
}