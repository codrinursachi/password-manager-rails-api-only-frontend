import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../ui/sidebar";
import { Link, useSearchParams } from "react-router";
import FoldersDropdown from "./folders-dropdown";
import { useQuery } from "@tanstack/react-query";
import { queryFolders } from "@/util/query-utils/query-folders";
import SidebarUserFoldersGroupLabel from "./sidebar-user-folders-group-label";
import { UserFoldersSkeleton } from "../skeletons/user-folders-skeleton";

function SidebarUserFoldersGroup() {
    const { data } = useQuery({
        queryKey: ["folders"],
        queryFn: ({ signal }) => queryFolders(signal),
    });
    const currentFolder = useSearchParams()[0].get("folder_id");
    return (
        <SidebarGroup>
            <SidebarUserFoldersGroupLabel />
            <SidebarGroupContent>
                <SidebarMenu>
                    {!data && <UserFoldersSkeleton />}
                    {data?.map((folder: { id: number; name: string }) => (
                        <SidebarMenuItem key={folder.id}>
                            <SidebarMenuButton
                                asChild
                                isActive={
                                    currentFolder === folder.id.toString()
                                }
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
    );
}

export default SidebarUserFoldersGroup;
