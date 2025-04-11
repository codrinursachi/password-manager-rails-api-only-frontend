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
import { Form, Link, useLoaderData } from "react-router";
import { Button } from "./ui/button";
import FoldersDropdown from "./folders-dropdown";

const specialLocations = [
  ["All logins", "/"],
  ["Favorites", "/?favorite=true"],
  ["Shared by me", "/shared-logins?by_me=true"],
  ["Shared with me", "/shared-logins"],
];

export function AppSidebar() {
  const folders = useLoaderData();
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
                  <SidebarMenuButton asChild>
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
          <SidebarGroupAction title="Add folder">
            <Plus /> <span className="sr-only">Add folder</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {folders.map((folder) => (
                <SidebarMenuItem key={folder.id}>
                  <SidebarMenuButton asChild>
                    <a href={"/?folder_id=" + folder.id}>
                      <span>{folder.name}</span>
                    </a>
                  </SidebarMenuButton>
                  <FoldersDropdown />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="trash">
                <SidebarMenuButton asChild>
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
