import getMe from "@/actions/user"
import { getTranslations } from "next-intl/server";

export default async function Dashboard() {

    const t = await getTranslations("pages.app.dashboard");
    const me = await getMe();

    return (
        <main className="max-w-7xl mx-auto md:h-screen">
            <h1 className="font-semibold text-3xl mt-14">{t('title')}</h1>
            {me?.containers.map((container) => (
                <div key={container.id}>
                    <h1>{container.name}</h1>
                </div>
            ))}

            {me?.containers.length === 0
                ? <p className="text-center mt-32" dangerouslySetInnerHTML={{ __html: t('empty') }} />
                : null}
        </main>
    )
}