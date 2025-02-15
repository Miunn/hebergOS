import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { robotoMono } from "@/ui/fonts";
import { ContainerWithActivity, ContainerWithUsers } from "@/lib/definitions";
import ActivitiesCard from "./ActivitiesCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import LinkContainers from "../dialogs/users/LinkContainers";
import { Button } from "../ui/button";
import LinkUsers from "../dialogs/containers/LinkUsers";
import { UserRoundPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";

export default function ContainerOverview({ container }: { container: ContainerWithActivity & ContainerWithUsers }) {

    const session = useSession();
    const t = useTranslations("pages.app.container.overview");

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className={`${robotoMono.className} text-primary`}>{t('title', { name: container.name })}</CardTitle>
                </CardHeader>
            </Card>

            <ActivitiesCard container={container} />

            <Card className="h-fit">
                <CardHeader>
                    <CardTitle className="text-primary flex justify-between">
                        {t('users.title')}
                        {session.data?.user.roles.includes(Role.ADMIN)
                            ? <TooltipProvider>
                                <Tooltip>
                                    <LinkUsers container={container}>
                                        <TooltipTrigger asChild>
                                            <Button variant={"outline"} size={"icon"} className="text-secondary hover:text-secondary">
                                                <UserRoundPlus />
                                            </Button>
                                        </TooltipTrigger>
                                    </LinkUsers>
                                    <TooltipContent>
                                        <p>{t('users.linkUsers')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            : null
                        }

                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {container.users.map((user) => (
                        <p key={user.id}>
                            {user.name}<br />
                            <i>{user.email}</i>
                        </p>
                    ))}
                    {container.users.length === 0
                        ? <p className="italic mx-auto max-w-72 text-wrap text-center">{t('users.empty')}</p>
                        : null}
                </CardContent>
            </Card>
        </div>
    )
}