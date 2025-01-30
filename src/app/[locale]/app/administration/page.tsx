import { getContainersAdmin } from "@/actions/containers";
import { getUsers } from "@/actions/user";
import CreateContainerDialog from "@/components/dialogs/containers/CreateContainer";
import CreateUserDialog from "@/components/dialogs/users/CreateUser";
import ContainersTable from "@/components/tables/ContainersTable";
import UsersTable from "@/components/tables/UsersTable";
import { Button } from "@/components/ui/button";
import { robotoMono } from "@/ui/fonts";
import { getTranslations } from "next-intl/server";

export default async function AdministrationPage() {

    const t = await getTranslations('pages.app.administration');
    const users = await getUsers();
    const containers = await getContainersAdmin();

    return (
        <>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h1 className={`${robotoMono.className} text-xl`}>{t('users')}</h1>

                    <CreateUserDialog>
                        <Button variant={"secondary"}>
                            {t('createUser')}
                        </Button>
                    </CreateUserDialog>
                </div>
                <UsersTable users={users} />
            </div>

            <div className="mt-10">
            <div className="flex justify-between items-center mb-2">
                <h1 className={`${robotoMono.className} text-xl`}>{t('containers')}</h1>
             
                <CreateContainerDialog>
                        <Button variant={"secondary"}>
                            {t('createContainer')}
                        </Button>
                    </CreateContainerDialog>
                </div>
                
                <ContainersTable containers={containers} />
            </div>
        </>
    )
}