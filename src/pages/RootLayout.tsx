import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet, useSubmit } from "react-router";
import { useEffect } from "react";
import { getAuthToken, getTokenDuration } from "@/util/auth";

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

export const loader = async () => {
  const response = await fetch("http://127.0.0.1:3000/api/v1/folders", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: getAuthToken() || "",
    },
  });

  return response.json();
}