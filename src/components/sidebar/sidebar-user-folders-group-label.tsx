import { Plus } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { SidebarGroupAction, SidebarGroupLabel } from "../ui/sidebar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { mutateFolder } from "@/util/mutate-utils/mutate-folder";
import { useMutation } from "@tanstack/react-query";

function SidebarUserFoldersGroupLabel() {
    const folderMutation = useMutation({
        mutationFn: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.target as HTMLFormElement);
            mutateFolder(formData, null, "POST");
        },
    });
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
                    <DialogDescription className="hidden">
                        Enter folder name
                    </DialogDescription>
                    <form onSubmit={folderMutation.mutate}>
                        <Input type="text" name="folder[name]" />
                        <br />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="submit">Create</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default SidebarUserFoldersGroupLabel;
