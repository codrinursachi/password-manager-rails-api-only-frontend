import { redirect } from "react-router";

export function action() {
  localStorage.clear();
  return redirect("/login");
}
