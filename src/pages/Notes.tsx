import { Button } from "@/components/ui/button";
import UserNote from "@/components/user-note";
import { queryNotes } from "@/util/query-utils/query-notes";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function NotesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: ({ signal }) => queryNotes(signal),
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log(data);
  const [editingNewNote, setEditingNewNote] = useState(false);
  function finishedEditing() {
    setEditingNewNote(false);
  }
  return (
    <div className="flex flex-col w-full gap-4">
      <h1>Notes</h1>
      <Button
        variant="outline"
        className="w-46"
        onClick={() => setEditingNewNote(true)}
      >
        Create note
      </Button>
      <div className="flex flex-wrap gap-4">
        {data?.notes.map((note) => (
          <UserNote key={note.id} text={note.text} id={note.id} />
        ))}
        {editingNewNote && (
          <UserNote text="" whenEditingFinished={finishedEditing} />
        )}
      </div>
    </div>
  );
}

export default NotesPage;
