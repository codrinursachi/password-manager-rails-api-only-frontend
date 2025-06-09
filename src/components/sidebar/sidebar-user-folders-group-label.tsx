import { Plus } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { SidebarGroupAction, SidebarGroupLabel } from "../ui/sidebar";
import { Form } from "react-router";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function SidebarUserFoldersGroupLabel() {
    return (
        <>
            <SidebarGroupLabel>Folders</SidebarGroupLabel>
            <Dialog>
                <DialogTrigger asChild>
                    <SidebarGroupAction title="Add folder">
                        <Plus /> <span className="sr-only">Add folder</span>
                    </SidebarGroupAction>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Add folder</DialogTitle>
                    <Form method="post" action="/folders">
                        <Input type="text" name="folder[name]" />
                        <br />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="submit">Create</Button>
                            </DialogClose>
                        </DialogFooter>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default SidebarUserFoldersGroupLabel;
