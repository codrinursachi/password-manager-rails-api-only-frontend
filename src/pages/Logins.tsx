import LoginsTable from "@/components/logins/logins-table";
import LoginDialog from "@/components/logins/login-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { queryLogins } from "@/util/query-utils/query-logins";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "@/components/ui/alert";

const LoginsPage = () => {
    const navigate = useNavigate();
    const url = new URL(window.location.href);
    const queryParameter = url.searchParams.toString();
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get("search")?.toString() || "";
        const url = new URL(window.location.href);
        url.searchParams.set("q", query);
        navigate(`${url.pathname}?${url.searchParams.toString()}`);
    };
    const { data, error } = useQuery({
        queryKey: ["logins", queryParameter],
        queryFn: ({ signal }) => queryLogins(queryParameter, signal),
    });

    if (error) {
        return <Alert variant="destructive">Error: {error.message}</Alert>;
    }

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
            {<LoginsTable logins={data?.logins} />}
        </div>
    );
};

export default LoginsPage;