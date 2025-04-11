import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const LoginDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuItem>
          <span>Edit login</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>Delete login</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>Copy password</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>Copy username</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LoginDropdown;
