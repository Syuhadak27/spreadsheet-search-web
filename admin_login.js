import { config } from "./config";

const admin_un = config.ADMIN_USERNAME;
const admin_pw = config.ADMIN_PASWORD;

export function handleAdminAuth(request) {
    const url = new URL(request.url);
    const adminCredentials = { username: `${admin_un}`, password: `${admin_pw}` };
  
    if (url.pathname === "/login-admin") {
      const username = url.searchParams.get("username");
      const password = url.searchParams.get("password");
  
      if (username !== adminCredentials.username || password !== adminCredentials.password) {
        return new Response("Login admin gagal!", { status: 403 });
      }
  
      return new Response("Admin login berhasil", {
        headers: {
          "Set-Cookie": "loggedInUser=admin; path=/; HttpOnly; Secure;",
          "Content-Type": "text/plain",
        },
      });
    }
  
    if (url.pathname === "/logout-admin") {
      return new Response("Logout berhasil. Redirecting...", {
        status: 302,
        headers: {
          "Set-Cookie": "loggedInUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;",
          "Location": "/admin-login-form", // Redirect ke form login admin
        },
      });
    }
  
    return new Response("Not Found", { status: 404 });
  }
  