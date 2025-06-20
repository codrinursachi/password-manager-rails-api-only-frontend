import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link, useNavigate } from "react-router";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { decryptAES } from "@/util/crypt-utils/cryptography";
import { useMutation } from "@tanstack/react-query";
import { mutateLogin } from "@/util/mutate-utils/mutate-login";
import { mutateSharedLogin } from "@/util/mutate-utils/mutate-shared-login";
import { queryClient } from "@/util/query-utils/query-client";
import { toast } from "sonner";

type Login = {
    login_name: string;
    login_password: string;
    iv: string;
    file?: string;
    login_id: number;
    urls: string[];
};

const LoginDropdown: React.FC<{ login: Login }> = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const loginMutation = useMutation({
        mutationFn: async (login_id: string) => {
            await mutateLogin(null, login_id, "DELETE");
        },
        mutationKey: ["login", "trash"],
        onError: (error: Error) => {
            console.error(error);
            toast.error(error.message, {
                description: "Error sending login to trash",
                action: {
                    label: "Try again",
                    onClick: () =>
                        loginMutation.mutate(loginMutation.variables!),
                },
            });
        },
        onSettled: () => {
            queryClient.setQueryData(
                ["logins", ""],
                (oldData: { logins: { login_id: number }[] }) => ({
                    logins: oldData.logins.filter(
                        (login) => login.login_id !== props.login.login_id
                    ),
                })
            );
            queryClient.invalidateQueries({ queryKey: ["logins"] });
        },
    });
    const sharedLoginMutation = useMutation({
        mutationFn: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.target as HTMLFormElement);
            navigate("/shared-logins/by-me");
            await mutateSharedLogin(formData, props.login.login_id.toString());
        },
        mutationKey: ["sharedLogins", "add"],
        onError: (error: Error) => {
            console.error(error);
            toast.error(error.message, {
                description: "Error sharing login",
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
            queryClient.invalidateQueries({ queryKey: ["shared-logins"] });
        },
    });
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
                            navigator.clipboard.writeText(
                                await decryptAES(
                                    props.login.login_password,
                                    props.login.iv
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
                        <DialogDescription className="hidden">
                            Enter email address to share login.
                        </DialogDescription>
                        <form onSubmit={sharedLoginMutation.mutate}>
                            <Input
                                type="hidden"
                                name="shared_login_datum[name]"
                                value={props.login.login_name}
                            />
                            <Input
                                type="hidden"
                                name="shared_login_datum[login_name]"
                                value={props.login.login_name}
                            />
                            <Input
                                type="hidden"
                                name="shared_login_datum[urls_attributes][0][uri]"
                                value={props.login.urls[0]}
                            />
                            <Input
                                type="text"
                                name="shared_login_datum[email]"
                            />
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
                        </form>
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
                            <DialogTitle>
                                Are you sure you want to send to trash?
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="hidden">
                            Send login to trash.
                        </DialogDescription>
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
                                <Button
                                    type="button"
                                    onClick={() => {
                                        loginMutation.mutate(
                                            props.login.login_id.toString()
                                        );
                                        setDropdownOpen(false);
                                    }}
                                >
                                    Yes
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LoginDropdown;
