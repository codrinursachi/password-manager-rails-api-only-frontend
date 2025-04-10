import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "./login-form";
import { useActionState } from "react";
import { getAuthToken } from "@/util/auth";
async function loginAction(prevState, formData) {
  const response = await fetch("http://127.0.1:3000/api/v1/logins", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: getAuthToken() || "",
    },
    body: formData,
  });
  if (!response.ok) {
    console.log(await response.json());
  }
  alert("Login created successfully");
  return { error: null };
}
const NewLoginDialog = () => {
  const [formState, formAction, pending] = useActionState(loginAction, {
    error: null,
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create login</DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <LoginForm />
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
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewLoginDialog;
