import { queryClient } from "@/util/query-utils/query-client";
import { redirect } from "react-router";

export function action() {
    localStorage.clear();
    queryClient.clear();
    return redirect("/login");
}
