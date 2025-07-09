import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import React, { useState } from "react";
import { Button } from "../ui/button";
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
import { useMutation } from "@tanstack/react-query";
import { mutateTrashedLogin } from "@/util/mutate-utils/mutate-trashed-login";
import { queryClient } from "@/util/query-utils/query-client";
import { toast } from "sonner";

type TrashedLogin = {
    login_id: number;
};

const TrashedLoginDropdown: React.FC<{ login: TrashedLogin }> = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const trashedLoginMutation = useMutation({
        mutationFn: async ({
            event,
            loginId,
            method,
        }: {
            event: React.FormEvent<HTMLFormElement>;
            loginId: number;
            method: "DELETE" | "PATCH";
        }) => {
            event.preventDefault();
            mutateTrashedLogin(loginId.toString(), method);
        },
        onError: (error: Error, variables) => {
            console.error(error);
            toast.error(error.message, {
                description: "Error performing trashed login action",
                action: {
                    label: "Try again",
                    onClick: () => trashedLoginMutation.mutate(variables),
                },
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["trashedLogins"] });
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
            <DropdownMenuContent side="left" align="start">
                <DropdownMenuItem>
                    <form
                        onSubmit={(event) =>
                            trashedLoginMutation.mutate({
                                event,
                                loginId: props.login.login_id,
                                method: "PATCH",
                            })
                        }
                    >
                        <button type="submit">Restore login</button>
                    </form>
                </DropdownMenuItem>
                <Dialog>
                    <DialogTrigger asChild>
                        <DropdownMenuItem
                            onSelect={(event) => event.preventDefault()}
                        >
                            Delete login
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Are you sure you want to delete login?
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="hidden">
                            Delete login.
                        </DialogDescription>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <form
                                onSubmit={(event) =>
                                    trashedLoginMutation.mutate({
                                        event,
                                        loginId: props.login.login_id,
                                        method: "DELETE",
                                    })
                                }
                            >
                                <DialogClose asChild>
                                    <Button type="submit" variant="destructive">
                                        Delete
                                    </Button>
                                </DialogClose>
                            </form>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default TrashedLoginDropdown;
