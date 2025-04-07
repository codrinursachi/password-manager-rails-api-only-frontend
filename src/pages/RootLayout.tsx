import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Outlet } from "react-router";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const RootLayout: React.FC<{isLoggedIn: boolean}>  = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!props.isLoggedIn) {
      navigate("/login");
    }
  }, [props.isLoggedIn]);
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default RootLayout;
