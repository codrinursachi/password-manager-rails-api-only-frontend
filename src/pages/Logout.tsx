import { redirect } from "react-router";

export function action() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  fetch("http://127.0.0.1:3000/api/v1/logout", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return redirect("/login");
}
