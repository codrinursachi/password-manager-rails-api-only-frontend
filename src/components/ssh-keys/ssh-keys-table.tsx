import { Form, Link } from "react-router";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../ui/table";
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

type sshKey = {
    id: number;
    name: string;
    public_key: string;
    private_key: string;
    iv: string;
    notes: string;
};

const sshKeysTable: React.FC<{ sshKeys: sshKey[] }> = (props) => {
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
                {props.sshKeys.map((sshKey) => (
                    <TableRow key={sshKey.id}>
                        <TableCell>
                            <Link to={"/ssh-keys/" + sshKey.id}>
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
                                    <DialogFooter>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">
                                                Cancel
                                            </Button>
                                        </DialogTrigger>
                                        <Form
                                            method="delete"
                                            action={"/ssh-keys/" + sshKey.id}
                                        >
                                            <Button
                                                type="submit"
                                                variant="destructive"
                                            >
                                                Delete
                                            </Button>
                                        </Form>
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
