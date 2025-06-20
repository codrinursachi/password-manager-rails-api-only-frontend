import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import SSHKeyFormInputs from "./ssh-key-form-inputs";
import { useMutation } from "@tanstack/react-query";
import { mutateSSHKey } from "@/util/mutate-utils/mutate-ssh-key";
import { queryClient } from "@/util/query-utils/query-client";
import { toast } from "sonner";

function SSHKeyDialog() {
    const keyId = useParams().keyId;
    const isNew = useLocation().pathname.includes("new");
    const [dialogOpen, setDialogOpen] = useState(false);
    useEffect(() => {
        setDialogOpen(keyId !== undefined || isNew);
    }, [keyId, isNew]);
    const navigate = useNavigate();
    const sshKeyMutation = useMutation({
        mutationFn: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.target as HTMLFormElement);
            const method = keyId ? "PATCH" : "POST";
            await mutateSSHKey(formData, keyId, method);
        },
        mutationKey: ["sshKeys", "add"],
        onError: (error: Error) => {
            console.error(error);
            toast.error(error.message, {
                description: "Error saving SSH key",
                action: {
                    label: "Try again",
                    onClick: () => sshKeyMutation.mutate(sshKeyMutation.variables!),
                },
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["sshKeys"] });
        },
    });
    return (
        <Dialog
            open={dialogOpen}
            onOpenChange={(isOpen) => {
                setDialogOpen(isOpen);
                if (!isOpen) {
                    setTimeout(() => navigate(-1), 200);
                }
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {keyId ? "Edit" : "Create"} ssh key
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="hidden">
                    {keyId ? "Edit" : "Create"} ssh key
                </DialogDescription>
                <form
                    onSubmit={sshKeyMutation.mutate}
                    encType="multipart/form-data"
                >
                    <SSHKeyFormInputs />
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="submit">Save</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default SSHKeyDialog;
