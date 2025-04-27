import { redirect } from "react-router";

export function getTokenDuration() {
  const expiration = localStorage.getItem("expiration");
  const expirationDate = new Date(expiration || "");
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}

export function getAuthToken() {
  const token = localStorage.getItem("token");
  const duration = getTokenDuration();
  if (duration < 0) {
    return "EXPIRED";
  }

  return 'Bearer ' + token;
}

export function checkAuthLoader() {
  const token = getAuthToken();
  if (token === "EXPIRED") {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }
  if (!token) {
    return redirect("/login");
  }

  return null;
}
