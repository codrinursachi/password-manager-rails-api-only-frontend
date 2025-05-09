import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { Form, Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import SidebarUserFoldersGroup from "./sidebar-user-folders-group";
import SidebarFoldersGroups from "./sidebar-folders-groups";

export function AppSidebar() {
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
        <SidebarFoldersGroups currentUrl={currentUrl}>
          <SidebarUserFoldersGroup />
        </SidebarFoldersGroups>
      </SidebarContent>
      <SidebarFooter>
        <Form action="/logout" method="post">
          <Button>Logout</Button>
        </Form>
      </SidebarFooter>
    </Sidebar>
  );
}
