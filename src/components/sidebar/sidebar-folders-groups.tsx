import { Link } from "react-router";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../ui/sidebar";

const specialLocations = [
    ["All logins", "/logins"],
    ["Favorites", "/logins?favorite=true"],
    ["Shared by me", "/shared-logins/by-me"],
    ["Shared with me", "/shared-logins/with-me"],
    ["Notes", "/notes"],
    ["SSH Keys", "/ssh-keys"],
];

function SidebarFoldersGroups({
    currentUrl,
    children,
}: {
    currentUrl: string;
    children: React.ReactNode;
}) {
    return (
        <>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {specialLocations.map(([name, path]) => (
                            <SidebarMenuItem key={path}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={currentUrl === path}
                                >
                                    <Link to={path}>
                                        <span>{name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            {children}
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem key="trash">
                            <SidebarMenuButton
                                asChild
                                isActive={currentUrl === "/trash"}
                            >
                                <Link to="/trash">
                                    <span>Trash</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </>
    );
}

export default SidebarFoldersGroups;
