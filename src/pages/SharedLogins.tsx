import LoginDialog from "@/components/logins/login-dialog";
import SharedLoginsTable from "@/components/shared-logins/shared-logins-table";

const SharedLoginsPage = () => {
    return (
        <div className="flex flex-col gap-4">
            <h1>Shared Logins</h1>
            <LoginDialog />
            <SharedLoginsTable />
        </div>
    );
};

export default SharedLoginsPage;
