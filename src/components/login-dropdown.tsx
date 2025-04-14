import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router";

const LoginDropdown = (props) => {
  return (
    <DropdownMenu>
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
          <span>Edit login</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>Share login</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>Send to trash</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LoginDropdown;
