import { Link } from "react-router";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../ui/table";
import { useEffect } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { TableContentSkeleton } from "../skeletons/table-content-skeleton";
import { useMutation, useMutationState, useQuery } from "@tanstack/react-query";
import { mutateSSHKey } from "@/util/mutate-utils/mutate-ssh-key";
import { queryClient } from "@/util/query-utils/query-client";
import { toast } from "sonner";
import { querySSHKeys } from "@/util/query-utils/query-ssh-keys";

type SSHKey = {
    id: number;
    name: string;
    public_key: string;
    private_key: string;
    iv: string;
    notes: string;
};

function sshKeysTable() {
    const { data, error } = useQuery<{ sshKeys: SSHKey[] }>({
        queryKey: ["sshKeys"],
        queryFn: ({ signal }) => querySSHKeys(signal),
    });
    useEffect(() => {
        if (error) {
            toast.error(error.message, {
                description: "Failed to load ssh keys.",
                action: {
                    label: "Retry",
                    onClick: () =>
                        queryClient.invalidateQueries({
                            queryKey: ["sshKeys"],
                        }),
                },
            });
        }
    }, [error]);
    const sshKeyMutation = useMutation({
        mutationFn: async (keyId: number) => {
            await mutateSSHKey(null, keyId.toString(), "DELETE");
        },
        mutationKey: ["sshKeys", "delete"],
        onError: (error: Error) => {
            toast.error(error.message, {
                description: "Error deleting SSH key",
                action: {
                    label: "Try again",
                    onClick: () =>
                        sshKeyMutation.mutate(sshKeyMutation.variables!),
                },
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["sshKeys"],
            });
        },
    });
    const pendingSSHKeysDelete = useMutationState({
        filters: { mutationKey: ["sshKeys", "delete"], status: "pending" },
        select: (mutation) => mutation.state.variables,
    });
    const pendingSSHKeysAdd = useMutationState({
        filters: { mutationKey: ["sshKeys", "add"], status: "pending" },
        select: (mutation) => {
            const formData = new FormData(
                (mutation.state.variables as React.FormEvent<HTMLFormElement>)
                    .target as HTMLFormElement
            );
            return formData.get("sshkey[name]")!.toString();
        },
    });
    return (
        <Table className="table-fixed">
            <TableHeader>
                <TableRow>
                    <TableHead key="name">Name</TableHead>
                    <TableHead key="actions" className="w-14">
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {!data?.sshKeys && <TableContentSkeleton cellNumber={2} />}
                {data?.sshKeys?.map((sshKey) => {
                    const pendingDelete = pendingSSHKeysDelete.find(
                        (key) => key === sshKey.id
                    );
                    return (
                        <TableRow
                            key={sshKey.id}
                            className={pendingDelete ? "text-red-500" : ""}
                        >
                            <TableCell>
                                <Link to={"/ssh-keys/" + sshKey.id + "/edit"}>
                                    <div className="w-full">{sshKey.name}</div>
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant={"ghost"}
                                            className="cursor-pointer"
                                        >
                                            <i className="fas fa-trash-can" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Are you sure you want to delete
                                                key pair?
                                            </DialogTitle>
                                        </DialogHeader>
                                        <DialogDescription className="hidden">
                                            Delete ssh key.
                                        </DialogDescription>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline">
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <form
                                                onSubmit={(event) => {
                                                    event.preventDefault();
                                                    sshKeyMutation.mutate(
                                                        sshKey.id
                                                    );
                                                }}
                                            >
                                                <DialogClose asChild>
                                                    <Button
                                                        type="submit"
                                                        variant="destructive"
                                                    >
                                                        Delete
                                                    </Button>
                                                </DialogClose>
                                            </form>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    );
                })}
                {pendingSSHKeysAdd.map((sshKey, index) => (
                    <TableRow key={"pending-add-"+index} className="text-gray-500">
                        <TableCell>
                            <div className="w-full">{sshKey}</div>
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default sshKeysTable;
