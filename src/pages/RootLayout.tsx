import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Outlet, useSubmit } from "react-router";
import { useEffect } from "react";
import { getTokenDuration } from "@/util/auth";

const RootLayout = () => {
    const submit = useSubmit();
    useEffect(() => {
        const expiration = getTokenDuration();
        setTimeout(() => {
            submit(null, { action: "/logout", method: "post" });
        }, expiration);
    }, []);

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="p-4 ">
                <Outlet />
            </main>
        </SidebarProvider>
    );
};

export default RootLayout;
