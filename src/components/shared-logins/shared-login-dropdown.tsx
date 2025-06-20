import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link, useLocation } from "react-router";
import React, { useState } from "react";
import { queryLogin } from "@/util/query-utils/query-login";
import {
    decryptAES,
    decryptRSAPassword,
} from "@/util/crypt-utils/cryptography";
import { queryClient } from "@/util/query-utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { mutateSharedLogin } from "@/util/mutate-utils/mutate-shared-login";
import { toast } from "sonner";

const getPasswordSharedByMe = async (id: string) => {
    const { individualLogin } = await queryClient.fetchQuery({
        queryKey: ["individualLogin", id],
        queryFn: ({ signal }) => queryLogin(id, signal),
    });
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
    login_id: number;
};

const LoginDropdown: React.FC<{ login: Login }> = (props) => {
    const currentUrl = useLocation().pathname;
    const byMe = currentUrl.includes("by-me");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const sharedLoginMutation = useMutation({
        mutationFn: async (loginId:string) => {
            await mutateSharedLogin(null, loginId);
        },
        mutationKey: ["sharedLogins", "delete"],
        onError: (error: Error) => {
            toast.error(error.message, {
                description: "Error deleting shared login",
                action: {
                    label: "Try again",
                    onClick: () =>
                        sharedLoginMutation.mutate(
                            sharedLoginMutation.variables!
                        ),
                },
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["sharedLogins", byMe ? "by_me=true" : ""],
            });
        },
    });
    return (
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
                <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem>
                    <span
                        onClick={() =>
                            navigator.clipboard.writeText(
                                props.login.login_name
                            )
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
                                      await getPasswordSharedByMe(
                                          props.login.login_id.toString()
                                      )
                                  )
                                : navigator.clipboard.writeText(
                                      await getPasswordSharedWithMe(
                                          props.login.login_password
                                      )
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
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        sharedLoginMutation.mutate(props.login.id.toString());
                    }}
                >
                    <button type="submit">
                        <DropdownMenuItem>
                            <span>Delete shared login</span>
                        </DropdownMenuItem>
                    </button>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LoginDropdown;
