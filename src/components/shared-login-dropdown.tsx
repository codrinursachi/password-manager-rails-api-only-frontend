import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Form, Link, useLocation } from "react-router";
import React, { useState } from "react";
import { queryLogin } from "@/util/query-login";
import { decryptAES, decryptRSAPassword } from "@/util/cryptography";

const getPasswordSharedByMe = async (id: string) => {
  const { individualLogin } = await queryLogin(id);
  return decryptAES(individualLogin.login_password, individualLogin.iv);
};

const getPasswordSharedWithMe = async (password: string) => {
  return decryptRSAPassword(password);
};

type Login = {
  login_name: string;
  login_password: string;
  iv: string;
  file?: string;
  id: number;
};

const LoginDropdown: React.FC<{ login: Login }> = (props) => {
  const currentUrl = useLocation().pathname;
  const byMe = currentUrl.includes("by-me");
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
            onClick={async () =>
              byMe
                ? navigator.clipboard.writeText(
                    await getPasswordSharedByMe(props.login.id.toString())
                  )
                : navigator.clipboard.writeText(
                    await getPasswordSharedWithMe(props.login.login_password)
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
        <Form
          method="delete"
          action={
            byMe
              ? `/shared-logins/by-me/${props.login.id}`
              : `/shared-logins/with-me/${props.login.id}`
          }
        >
          <button type="submit">
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
