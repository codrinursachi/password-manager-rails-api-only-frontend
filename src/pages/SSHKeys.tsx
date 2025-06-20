import SSHKeyDialog from "@/components/ssh-keys/ssh-key-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import SSHKeysTable from "@/components/ssh-keys/ssh-keys-table";

function SSHKeysPage() {
    const navigate = useNavigate();
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
                <SSHKeysTable />
            </div>
            <SSHKeyDialog />
        </div>
    );
}

export default SSHKeysPage;
