import { Form, Link } from "react-router";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../ui/table";
import React, { useEffect, useState } from "react";
import { decryptAES } from "@/util/crypt-utils/cryptography";
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
import { mutateNote } from "@/util/mutate-utils/mutate-note";
import { toast } from "sonner";
import { queryClient } from "@/util/query-utils/query-client";

type note = {
    id: number;
    name: string;
    name_iv: string;
    text: string;
    text_iv: string;
};

const NotesTable: React.FC<{ notes: note[] }> = (props) => {
    const [notes, setNotes] = useState(props.notes);
    useEffect(() => {
        async function decryptNotesNames() {
            setNotes(
                await Promise.all(
                    props.notes.map(async (note) => ({
                        ...note,
                        name: await decryptAES(note.name, note.name_iv),
                    }))
                )
            );
        }

        props.notes && decryptNotesNames();
    }, [props.notes]);
    const noteMutation = useMutation({
        mutationFn: async ({
            event,
            noteId,
        }: {
            event: React.FormEvent<HTMLFormElement>;
            noteId: string;
        }) => {
            event.preventDefault();
            mutateNote(null, noteId, "DELETE");
        },
        onError: (error: Error) => {
            console.error(error);
            toast.error(error.message, {
                description: "Error deleting note",
                action: {
                    label: "Try again",
                    onClick: () => console.log("Undo"),
                },
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
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
                {!notes && <TableContentSkeleton cellNumber={2} />}
                {notes?.map((note) => (
                    <TableRow key={note.id}>
                        <TableCell>
                            <Link to={"/notes/" + note.id + "/edit"}>
                                <div className="w-full">{note.name}</div>
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
                                            note?
                                        </DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription className="hidden">
                                        Delete note
                                    </DialogDescription>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Form
                                            onSubmit={(event) =>
                                                noteMutation.mutate({
                                                    event,
                                                    noteId: note.id.toString(),
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

export default NotesTable;
