import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import React, { useState } from "react";
import { Form } from "react-router";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type TrashedLogin = {
  login_id: number;
};

const TrashedLoginDropdown: React.FC<{ login: TrashedLogin }> = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <DropdownMenu
      modal={false}
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
    >
      <DropdownMenuTrigger asChild>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="start">
        <DropdownMenuItem>
          <Form method="patch" action={"/trash/" + props.login.login_id}>
            <button type="submit">Restore login</button>
          </Form>
        </DropdownMenuItem>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
              Delete login
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete login?</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <DialogTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogTrigger>
              <Form method="delete" action={"/trash/" + props.login.login_id}>
                <Button type="submit" variant="destructive">
                  Delete
                </Button>
              </Form>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TrashedLoginDropdown;
