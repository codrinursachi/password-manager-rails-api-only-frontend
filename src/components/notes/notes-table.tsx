import { Link } from "react-router";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../ui/table";
import { useEffect, useState } from "react";
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
import { useMutation, useMutationState, useQuery } from "@tanstack/react-query";
import { mutateNote } from "@/util/mutate-utils/mutate-note";
import { toast } from "sonner";
import { queryClient } from "@/util/query-utils/query-client";
import { queryNotes } from "@/util/query-utils/query-notes";

type Note = {
    id: number;
    name: string;
    name_iv: string;
    text: string;
    text_iv: string;
};

function NotesTable() {
    const { data, error } = useQuery<{ notes: Note[] }>({
        queryKey: ["notes"],
        queryFn: ({ signal }) => queryNotes(signal),
    });
    useEffect(() => {
        if (error) {
            toast.error(error.message, {
                description: "Failed to load notes.",
                action: {
                    label: "Retry",
                    onClick: () =>
                        queryClient.invalidateQueries({ queryKey: ["notes"] }),
                },
            });
        }
    }, [error]);
    const [notes, setNotes] = useState(data?.notes);
    useEffect(() => {
        async function decryptNotesNames() {
            setNotes(
                await Promise.all(
                    data!.notes.map(async (note: Note) => ({
                        ...note,
                        name: await decryptAES(note.name, note.name_iv),
                    }))
                )
            );
        }

        data?.notes && decryptNotesNames();
    }, [data]);
    const noteMutation = useMutation({
        mutationFn: async (noteId: string) => {
            await mutateNote(null, noteId, "DELETE");
        },
        mutationKey: ["note", "delete"],
        onError: (error: Error) => {
            console.error(error);
            toast.error(error.message, {
                description: "Error deleting note",
                action: {
                    label: "Try again",
                    onClick: () => noteMutation.mutate(noteMutation.variables!),
                },
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
    });
    const pendingNotesAdd = useMutationState({
        filters: { mutationKey: ["note", "add"], status: "pending" },
        select: (mutation) => {
            const formData = new FormData(
                (mutation.state.variables as React.FormEvent<HTMLFormElement>)
                    .target as HTMLFormElement
            );
            return formData.get("note[name]")?.toString();
        },
    });
    const pendingNotesEdit = useMutationState({
        filters: { mutationKey: ["note", "edit"], status: "pending" },
        select: (mutation) => {
            const formData = new FormData(
                (mutation.state.variables as React.FormEvent<HTMLFormElement>)
                    .target as HTMLFormElement
            );
            return {
                id: formData.get("note[note_id]")?.toString(),
                name: formData.get("note[name]")?.toString(),
            };
        },
    });
    const pendingNotesDelete = useMutationState({
        filters: { mutationKey: ["note", "delete"], status: "pending" },
        select: (mutation) => mutation.state.variables,
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
                {notes?.map((note) => {
                    const pendingEdit = pendingNotesEdit.find(
                        (pendingNote) => pendingNote.id === note.id.toString()
                    );
                    note = pendingEdit
                        ? { ...note, name: pendingEdit.name! }
                        : note;
                    const pendingDelete = pendingNotesDelete.find(
                        (pendingNote) => pendingNote === note.id.toString()
                    );
                    return (
                        <TableRow
                            key={note.id}
                            className={
                                pendingEdit
                                    ? "text-green-500"
                                    : pendingDelete
                                    ? "text-red-500"
                                    : ""
                            }
                        >
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
                                            <DialogClose asChild>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        noteMutation.mutate(
                                                            note.id.toString()
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    );
                })}
                {pendingNotesAdd.map((note, index) => (
                    <TableRow
                        key={"pending-notes-add-" + index}
                        className="text-gray-500"
                    >
                        <TableCell>{note}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default NotesTable;
