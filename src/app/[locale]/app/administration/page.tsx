import { getUsers } from "@/actions/user";
import CreateUserDialog from "@/components/dialogs/users/CreateUser";
import UsersTable from "@/components/tables/UsersTable";
import { Button } from "@/components/ui/button";
import { robotoMono } from "@/ui/fonts";
import { getTranslations } from "next-intl/server";

export default async function AdministrationPage() {

    const t = await getTranslations('pages.app.administration');
    const users = await getUsers();

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <h1 className={`${robotoMono.className} text-xl`}>{t('users')}</h1>

                <CreateUserDialog>
                    <Button variant={"secondary"}>
                        {t('createUser')}
                    </Button>
                </CreateUserDialog>
            </div>
            <UsersTable users={users} />
        </div>
    )
}