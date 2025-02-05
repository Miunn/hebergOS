import { getMe } from "@/actions/user"
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import Container from "@/components/containers/ContainerCard";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { Fragment } from "react";

export default async function Dashboard() {

    const session = await getServerSession(authConfig);
    const t = await getTranslations("pages.app.dashboard");
    const me = await getMe();

    return (
        <>
            <h1 className="font-semibold text-3xl mt-24 mb-7 flex justify-between items-center">
                {t('title')}
            </h1>
            <div className="flex flex-wrap gap-6">
                {me?.containers.map((container) => (
                    <Fragment key={container.id}>
                        <Container id={container.id} name={container.name} state={container.state} />
                    </Fragment>
                ))}
            </div>

            {me?.containers.length === 0
                ? <p className="text-center mt-32" dangerouslySetInnerHTML={{ __html: t('empty') }} />
                : null}
        </>
    )
}