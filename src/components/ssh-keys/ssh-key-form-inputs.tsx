import { useQuery } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useParams } from "react-router";
import { decryptAES } from "@/util/crypt-utils/cryptography";
import { useEffect, useState } from "react";
import { generateKeyPair } from "web-ssh-keygen";
import { querySSHKey } from "@/util/query-utils/query-ssh-key";
import { Button } from "../ui/button";

function SSHKeyFormInputs() {
    const id = useParams().keyId;
    const [privateKey, setPrivateKey] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [privateKeyMasked, setPrivateKeyMasked] = useState(true);
    const { data } = useQuery({
        queryKey: ["individualSSHKey", id],
        queryFn: ({ signal }) => querySSHKey(id!, signal),
        enabled: !!id,
    });
    const individualSSHKey = data?.individualSSHKey;
    useEffect(() => {
        const decryptPass = async () => {
            const privateKey = await decryptAES(
                individualSSHKey?.private_key,
                individualSSHKey?.iv
            );
            setPrivateKey(privateKey);
            setPublicKey(individualSSHKey?.public_key);
        };
        data && decryptPass();
    }, [data]);
    useEffect(() => {
        async function generateSSHKey() {
            const { privateKey, publicKey } = await generateKeyPair({
                alg: "RSASSA-PKCS1-v1_5",
                size: 2048,
                hash: "SHA-256",
                name: "ssh-key",
            });

            setPrivateKey(privateKey);
            setPublicKey(publicKey);
        }

        !id && generateSSHKey();
    }, []);
    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                    Name
                </Label>
                <Input
                    id="name"
                    className="col-span-3"
                    name="sshkey[name]"
                    defaultValue={individualSSHKey?.name}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label
                    htmlFor="private-key"
                    className="flex flex-col items-start text-left mb-auto"
                >
                    Private key
                    <div>
                        <Button
                            variant={"ghost"}
                            type="button"
                            onClick={() =>
                                setPrivateKeyMasked(
                                    (privateKeyMasked) => !privateKeyMasked
                                )
                            }
                            className="h-5 w-5"
                        >
                            <i className="fas fa-eye" />
                        </Button>
                        <Button
                            variant={"ghost"}
                            type="button"
                            onClick={() =>
                                navigator.clipboard.writeText(privateKey)
                            }
                            className="h-5 w-5"
                        >
                            <i className="fas fa-clipboard" />
                        </Button>
                    </div>
                </Label>
                <Textarea
                    id="private-key"
                    className="col-span-3 h-30"
                    name="sshkey[private_key]"
                    readOnly={true}
                    value={"•".repeat(privateKey.length)}
                    hidden={!privateKeyMasked}
                />
                <Textarea
                    id="private-key"
                    className="col-span-3 h-30 "
                    name="sshkey[private_key]"
                    readOnly={true}
                    value={privateKey}
                    hidden={privateKeyMasked}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label
                    htmlFor="public-key"
                    className="flex flex-col items-start text-right mb-auto"
                >
                    Public key
                    <Button
                        variant={"ghost"}
                        type="button"
                        onClick={() => navigator.clipboard.writeText(publicKey)}
                        className="h-5 w-5"
                    >
                        <i className="fas fa-clipboard" />
                    </Button>
                </Label>
                <Textarea
                    id="public-key"
                    className="col-span-3 h-30"
                    name="sshkey[public_key]"
                    readOnly={true}
                    value={publicKey}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right mb-auto">
                    Notes
                </Label>
                <Textarea
                    id="notes"
                    className="col-span-3"
                    name="sshkey[notes]"
                    defaultValue={individualSSHKey?.notes}
                />
            </div>
        </div>
    );
}
export default SSHKeyFormInputs;
