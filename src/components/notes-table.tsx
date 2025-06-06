import { Form, Link } from "react-router";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import React, { useEffect, useState } from "react";
import { decryptAES } from "@/util/crypt-utils/cryptography";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

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

    decryptNotesNames();
  }, [props.notes]);
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead key="name">Name</TableHead>
          <TableHead key="actions" className="w-14">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notes.map((note) => (
          <TableRow key={note.id}>
            <TableCell>
              <Link to={"/notes/" + note.id}>
                <div className="w-full">{note.name}</div>
              </Link>
            </TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"ghost"} className="cursor-pointer">
                    <i className="fas fa-trash-can" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Are you sure you want to delete note?
                    </DialogTitle>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogTrigger>
                    <Form method="delete" action={"/notes/" + note.id}>
                      <Button type="submit" variant="destructive">
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

export default NotesTable;
