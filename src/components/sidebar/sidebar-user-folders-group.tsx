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
import { useEffect } from "react";
import { toast } from "sonner";
import { queryClient } from "@/util/query-utils/query-client";

function SidebarUserFoldersGroup() {
    const { data, error } = useQuery({
        queryKey: ["folders"],
        queryFn: ({ signal }) => queryFolders(signal),
    });
    useEffect(() => {
        if (error) {
            toast.error(error.message, {
                description: "Failed to load folders.",
                action: {
                    label: "Retry",
                    onClick: () =>
                        queryClient.invalidateQueries({
                            queryKey: ["folders"],
                        }),
                },
            });
        }
    }, [error]);
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
