import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import NotesFormInputs from "./notes-form-inputs";

function NotesDialog() {
  const noteId = useParams().noteId;
  const isNew = useLocation().pathname.includes("new");
  const [dialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    setDialogOpen(noteId !== undefined || isNew);
  }, [noteId, isNew]);
  const navigate = useNavigate();
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
          <DialogTitle>{noteId ? "Edit" : "Create"} ssh key</DialogTitle>
        </DialogHeader>
        <Form
          method={noteId ? "patch" : "post"}
          action={noteId ? `/notes/${noteId}` : "/notes/"}
        >
          <NotesFormInputs />
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default NotesDialog;
