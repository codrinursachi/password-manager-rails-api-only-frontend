import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Form, Link, useLocation } from "react-router";
import { useState } from "react";

const LoginDropdown = (props) => {
  const currentUrl = useLocation().pathname;
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
        <Form
          method="delete"
          action={
            currentUrl.includes("by-me")
              ? `/shared-logins/by-me/${props.login.id}`
              : `/shared-logins/with-me/${props.login.id}`
          }
        ><button type="submit">
          <DropdownMenuItem>
            <span>Delete shared login</span>
          </DropdownMenuItem>
          </button>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LoginDropdown;
