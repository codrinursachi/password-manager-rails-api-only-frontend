import LoginsTable from "@/components/logins/logins-table";
import LoginDialog from "@/components/logins/login-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams } from "react-router";

const LoginsPage = () => {
    const navigate = useNavigate();
    const [_searchParams, setSearchParams] = useSearchParams();
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get("search")?.toString() || "";
        setSearchParams({ q: query });
        e.currentTarget.reset();
    };

    return (
        <div className="flex flex-col gap-4">
            <h1>Logins</h1>
            <form
                className="flex w-full max-w-sm items-center space-x-2"
                onSubmit={handleSearch}
            >
                <Input type="text" name="search" />
                <Button type="submit">Search</Button>
            </form>
            <Button
                variant="outline"
                onClick={() => navigate("/logins/new")}
                className="w-46"
            >
                Create login
            </Button>
            <LoginDialog />
            {<LoginsTable />}
        </div>
    );
};

export default LoginsPage;
