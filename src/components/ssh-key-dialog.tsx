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
import SSHKeyFormInputs from "./ssh-key-form-inputs";

function SSHKeyDialog() {
  const keyId = useParams().keyId;
  const isNew = useLocation().pathname.includes("new");
  const [dialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    setDialogOpen(keyId !== undefined || isNew);
  }, [keyId, isNew]);
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
          <DialogTitle>
            {keyId ? "Edit" : "Create"} ssh key
          </DialogTitle>
        </DialogHeader>
        <Form
          method={keyId ? "patch" : "post"}
          action={keyId ? `/ssh-keys/${keyId}` : "/ssh-keys/"}
          encType="multipart/form-data"
        >
          <SSHKeyFormInputs />
          <DialogFooter
            className="sm:justify-start"
          >
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
};

export default SSHKeyDialog;
