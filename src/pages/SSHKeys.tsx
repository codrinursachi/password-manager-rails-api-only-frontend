import SSHKeyDialog from "@/components/ssh-keys/ssh-key-dialog";
import { Button } from "@/components/ui/button";
import { querySSHKeys } from "@/util/query-utils/query-ssh-keys";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import SSHKeysTable from "@/components/ssh-keys/ssh-keys-table";

function SSHKeysPage() {
    const navigate = useNavigate();
    const { data } = useQuery({
        queryKey: ["sshKeys"],
        queryFn: ({ signal }) => querySSHKeys(signal),
    });
    return (
        <div className="flex flex-col gap-4">
            <h1>SSH Keys</h1>
            <Button
                variant="outline"
                onClick={() => navigate("/ssh-keys/new")}
                className="w-46"
            >
                Add SSH key
            </Button>
            <div className="flex flex-wrap gap-4">
                <SSHKeysTable sshKeys={data?.sshKeys} />
            </div>
            <SSHKeyDialog />
        </div>
    );
}

export default SSHKeysPage;