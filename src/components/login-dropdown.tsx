import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Form, Link } from "react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { decryptAES } from "@/util/crypt-utils/cryptography";

type Login = {
  login_name: string;
  login_password: string;
  iv: string;
  file?: string;
  login_id: number;
};

const LoginDropdown: React.FC<{ login: Login }> = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  return (
    <DropdownMenu
      modal={false}
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
    >
      <DropdownMenuTrigger asChild>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuItem>
          <span
            onClick={() =>
              navigator.clipboard.writeText(props.login.login_name)
            }
          >
            Copy username
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span
            onClick={async () =>
              navigator.clipboard.writeText(
                await decryptAES(props.login.login_password, props.login.iv)
              )
            }
          >
            Copy password
          </span>
        </DropdownMenuItem>
        {props.login.file ? (
          <DropdownMenuItem>
            <Link
              to={"http://127.0.0.1:3000" + props.login.file}
              download
              target="_self"
            >
              Download file
            </Link>
          </DropdownMenuItem>
        ) : (
          ""
        )}
        <Link to={"/logins/" + props.login.login_id + "/edit"}>
          <DropdownMenuItem>
            <span>Edit login</span>
          </DropdownMenuItem>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
              }}
            >
              <span>Share login</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share login with:</DialogTitle>
            </DialogHeader>
            <Form method="post" action={"/shared-logins/"}>
              <Input
                type="hidden"
                name="shared_login_datum[login_id]"
                value={props.login.login_id}
              />
              <Input type="text" name="shared_login_datum[email]" />
              <br />
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="submit"
                    onClick={() => {
                      setDropdownOpen(false);
                    }}
                  >
                    Confirm
                  </Button>
                </DialogClose>
              </DialogFooter>
            </Form>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
              }}
            >
              <span>Send to trash</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to send to trash?</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDropdownOpen(false);
                  }}
                >
                  No
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Form
                  method="delete"
                  action={"/logins/" + props.login.login_id}
                >
                  <Button
                    type="submit"
                    onClick={() => {
                      setDropdownOpen(false);
                    }}
                  >
                    Yes
                  </Button>
                </Form>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LoginDropdown;
