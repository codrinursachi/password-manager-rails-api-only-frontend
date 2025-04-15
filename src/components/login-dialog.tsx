import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, useLocation, useNavigate, useParams } from "react-router";
import LoginFormInputs from "./login-form-inputs";
import { useEffect, useState } from "react";

const LoginDialog = () => {
  const loginId = useParams().loginId;
  const isNew = useLocation().pathname.includes("new");
  const [dialogOpen, setDialogOpen] = useState(loginId !== undefined);
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
          navigate("/logins/");
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{loginId ? "Edit" : "Create"} login</DialogTitle>
        </DialogHeader>
        <Form
          method={loginId ? "patch" : "post"}
          action={loginId ? `/logins/${loginId}` : "/logins"}
          encType="multipart/form-data"
        >
          <LoginFormInputs />
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
};

export default LoginDialog;
