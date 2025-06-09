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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { Form } from "react-router";
import { Input } from "../ui/input";

const FoldersDropdown: React.FC<{ folder: { id: number; name: string } }> = (
    props
) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
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
                        <Form
                            method="patch"
                            action={"/folders/" + props.folder.id}
                        >
                            <input
                                type="hidden"
                                name="id"
                                value="props.folder.id"
                            />
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
                        <Form
                            method="delete"
                            action={"/folders/" + props.folder.id}
                        >
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
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        onClick={() => {
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        Yes
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </Form>
                    </DialogContent>
                </Dialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default FoldersDropdown;
