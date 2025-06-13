import { Form, Link } from "react-router";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../ui/table";
import React, { use } from "react";
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
import { useMutation } from "@tanstack/react-query";
import { mutateSSHKey } from "@/util/mutate-utils/mutate-ssh-key";

type sshKey = {
    id: number;
    name: string;
    public_key: string;
    private_key: string;
    iv: string;
    notes: string;
};

const sshKeysTable: React.FC<{ sshKeys: sshKey[] }> = (props) => {
    const sshKeyMutation = useMutation({
        mutationFn: async ({
            event,
            keyId,
        }: {
            event: React.FormEvent<HTMLFormElement>;
            keyId: number;
        }) => {
            event.preventDefault();
            mutateSSHKey(null, keyId.toString(), "DELETE");
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
                {!props.sshKeys && <TableContentSkeleton cellNumber={2} />}
                {props.sshKeys?.map((sshKey) => (
                    <TableRow key={sshKey.id}>
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
                                            Are you sure you want to delete key
                                            pair?
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
                                            onSubmit={(event) =>
                                                sshKeyMutation.mutate({
                                                    event,
                                                    keyId: sshKey.id,
                                                })
                                            }
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
                ))}
            </TableBody>
        </Table>
    );
};

export default sshKeysTable;
