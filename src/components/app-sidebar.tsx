import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Plus } from "lucide-react";
import {
  Form,
  Link,
  useLoaderData,
  useLocation,
  useSearchParams,
} from "react-router";
import { Button } from "./ui/button";
import FoldersDropdown from "./folders-dropdown";
import { Dialog, DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { useQuery } from "@tanstack/react-query";
import { queryFolders } from "@/util/query-folders";

const specialLocations = [
  ["All logins", "/logins"],
  ["Favorites", "/logins?favorite=true"],
  ["Shared by me", "/shared-logins/by-me"],
  ["Shared with me", "/shared-logins/with-me"],
];

export function AppSidebar() {
  const { data } = useQuery({
    queryKey: ["folders"],
    queryFn: () => queryFolders(),
    initialData: useLoaderData(),
  });
  const currentFolder = useSearchParams()[0].get("folder_id");
  const { pathname, search } = useLocation();
  const currentUrl = pathname + search;
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/">
          <span className="text-xl">Password Manager </span>
          <i className="fas fa-shield-halved fa-lg"></i>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {specialLocations.map(([name, path]) => (
                <SidebarMenuItem key={path}>
                  <SidebarMenuButton asChild isActive={currentUrl === path}>
                    <Link to={path}>
                      <span>{name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
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
          <SidebarGroupContent>
            <SidebarMenu>
              {data.map((folder: { id: number; name: string }) => (
                <SidebarMenuItem key={folder.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentFolder === folder.id.toString()}
                  >
                    <Link to={"/logins?folder_id=" + folder.id}>
                      <span>{folder.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  {folder.name !== "No folder" ? (
                    <FoldersDropdown folder={folder} />
                  ) : (
                    ""
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="trash">
                <SidebarMenuButton asChild isActive={currentUrl === "/trash"}>
                  <Link to="/trash">
                    <span>Trash</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Form action="/logout" method="post">
          <Button>Logout</Button>
        </Form>
      </SidebarFooter>
    </Sidebar>
  );
}
