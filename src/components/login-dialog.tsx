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
import LoginFormInputs from "./login-form-inputs";
import { useEffect, useState } from "react";

const LoginDialog = () => {
  const loginId = useParams().loginId;
  const isNew = useLocation().pathname.includes("new");
  const isEditable = useLocation().pathname.includes("edit");
  const [dialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    setDialogOpen(loginId !== undefined || isNew);
  }, [loginId, isNew]);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {loginId ? (isEditable ? "Edit" : "View") : "Create"} login
          </DialogTitle>
        </DialogHeader>
        <Form
          method={loginId ? "patch" : "post"}
          action={loginId ? `/logins/${loginId}` : "/logins"}
          encType="multipart/form-data"
        >
          <LoginFormInputs isEditable={isEditable || isNew} />
          <DialogFooter className="sm:justify-start" hidden={!isEditable&&!isNew}>
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

export default LoginDialog;
