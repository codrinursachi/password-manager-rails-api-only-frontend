import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenuAction } from "./ui/sidebar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";

const FoldersDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen} modal={false}>
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
              <DialogTitle>test</DialogTitle>
              <DialogDescription>test</DialogDescription>
            </DialogHeader>
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
              <DialogTitle>test</DialogTitle>
              <DialogDescription>test</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit" onClick={
                  () => {
                    setDropdownOpen(false);
                  }
                }>Confirm</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FoldersDropdown;
