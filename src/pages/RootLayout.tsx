import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Form, Outlet, useSubmit } from "react-router";
import { useEffect } from "react";
import { getAuthToken, getTokenDuration } from "@/util/auth";
import { Button } from "@/components/ui/button";

const RootLayout = () => {
  const token = getAuthToken();
  const submit = useSubmit();
  useEffect(() => {
    if (token === "EXPIRED") {
      submit(null, { action: "/logout", method: "post" });
    }

    const expiration = getTokenDuration();
    setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, expiration);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-4 ">
        <Form action="/logout" method="post">
          <Button>Logout</Button>
        </Form>
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default RootLayout;
