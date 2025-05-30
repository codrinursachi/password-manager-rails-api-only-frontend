import { Link } from "react-router";
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default NotesTable;
