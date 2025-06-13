import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuAction } from "../ui/sidebar";
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
import { Button } from "../ui/button";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import { mutateFolder } from "@/util/mutate-utils/mutate-folder";

const FoldersDropdown: React.FC<{ folder: { id: number; name: string } }> = (
    props
) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const folderMutation = useMutation({
        mutationFn: async ({
            event,
            method,
            folderId,
        }: {
            event: React.FormEvent<HTMLFormElement>;
            method: "PATCH" | "DELETE";
            folderId: number;
        }) => {
            event.preventDefault();
            const formData = new FormData(event.target as HTMLFormElement);
            mutateFolder(formData, folderId.toString(), method);
        },
    });
    return (
        <DropdownMenu
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}
            modal={false}
        >
            <DropdownMenuTrigger asChild>
                <SidebarMenuAction>
                    <MoreHorizontal />
                </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
                <Dialog>
                    <DialogTrigger asChild>
                        <DropdownMenuItem
                            onSelect={(event) => {
                                event.preventDefault();
                            }}
                        >
                            <span>Edit folder</span>
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Rename folder</DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="hidden">
                            Enter folder name
                        </DialogDescription>
                        <form
                            onSubmit={(event) => {
                                folderMutation.mutate({
                                    event,
                                    method: "PATCH",
                                    folderId: props.folder.id,
                                });
                            }}
                        >
                            <Input
                                type="text"
                                name="folder[name]"
                                defaultValue={props.folder.name}
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
                            <span>Delete folder</span>
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Are you sure you want to remove the selected
                                folder?
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="hidden">
                            Remove folder
                        </DialogDescription>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setDropdownOpen(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <form
                                    onSubmit={(event) => {
                                        folderMutation.mutate({
                                            event,
                                            method: "DELETE",
                                            folderId: props.folder.id,
                                        });
                                    }}
                                >
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        onClick={() => {
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        Yes
                                    </Button>
                                </form>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default FoldersDropdown;
