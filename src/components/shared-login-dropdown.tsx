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
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const LoginDropdown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
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
            onClick={() =>
              navigator.clipboard.writeText(props.login.login_password)
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
        <DropdownMenuItem>
          <span>Delete shared login</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LoginDropdown;
