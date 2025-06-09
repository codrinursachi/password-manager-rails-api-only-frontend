import SSHKeyDialog from "@/components/ssh-keys/ssh-key-dialog";
import { Button } from "@/components/ui/button";
import { encryptAES } from "@/util/crypt-utils/cryptography";
import { networkFetch } from "@/util/network-utils/network-fetch";
import { queryClient } from "@/util/query-utils/query-client";
import { querySSHKeys } from "@/util/query-utils/query-ssh-keys";
import { useQuery } from "@tanstack/react-query";
import { redirect, useNavigate } from "react-router";
import SSHKeysTable from "@/components/ssh-keys/ssh-keys-table";

function SSHKeysPage() {
    const navigate = useNavigate();
    const { data, isLoading } = useQuery({
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
                {isLoading && <div>Loading...</div>}
                {data && <SSHKeysTable sshKeys={data?.sshKeys} />}
            </div>
            <SSHKeyDialog />
        </div>
    );
}

export default SSHKeysPage;

export async function action({
    request,
    params,
}: {
    request: Request;
    params: { keyId?: string };
}) {
    const keyId = params.keyId;
    const method = request.method.toUpperCase();
    const formData = await request.formData();
    if (method !== "DELETE") {
        const privateKeyData = await encryptAES(
            formData.get("sshkey[private_key]")?.toString()!
        );
        formData.set("sshkey[private_key]", privateKeyData.encryptedData);
        formData.set("sshkey[iv]", privateKeyData.iv);
    }
    await networkFetch(
        "sshkeys/" + (keyId ? keyId : ""),
        undefined,
        method,
        formData
    );
    queryClient.invalidateQueries({ queryKey: ["sshKeys"] });
    return redirect("/ssh-keys");
}
