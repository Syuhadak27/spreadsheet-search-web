import { handleHome } from "./home";
import { handleSearch } from "./function/search";
import { handleSearch_inout } from "./function/inout";
import { notFound } from "./routes";
import { handleSearch_list } from "./function/list";
import { resetSemuaCache } from "./function/reset";
import { handleSearch_stok } from "./function/stok";
import { loginPage, adminDashboard, getCookieValue, handleAdminLogs } from "./admin";
import { config } from "./config";
import { handleAdminAuth } from "./admin_login";


const allowedUsers = config.USER_WEB;
const adminCredentials = { username: "admin", password: "123" }; // Admin login

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cookie = request.headers.get("Cookie") || "";
    const loggedInUser = getCookieValue(cookie, "loggedInUser");
    const adminResponse = handleAdminAuth(request);
    if (adminResponse.status !== 404) return adminResponse;

    // Tambahkan endpoint untuk admin-logs
if (url.pathname === "/admin-logs") {
  if (loggedInUser !== "admin") {
    return new Response("Akses ditolak!", { status: 403 });
  }
  
  return handleAdminLogs(env);
}

    // ✅ Endpoint untuk menghapus semua log
    if (url.pathname === "/admin-logs-delete") {
      if (loggedInUser !== "admin") {
         return new Response("Akses ditolak!", { status: 403 });
      }

      const logs = await env.LOG_STORAGE.list();
      for (const log of logs.keys) {
         await env.LOG_STORAGE.delete(log.name);
      }

         return new Response("Semua log telah dihapus!", { status: 200 });
    }



    // **🔹 Endpoint untuk login user**
    if (url.pathname === "/login-user") {
      const user = url.searchParams.get("user");
      if (!user) return new Response("Username harus diisi", { status: 400 });

      if (!allowedUsers.includes(user)) {
        return new Response("Akses ditolak! Anda tidak diizinkan login.", { status: 403 });
      }

      const sessionID = request.headers.get("User-Agent") || "UnknownDevice";

      // **Cek apakah user sudah login dengan perangkat lain**
      const loggedInSession = await env.DATABASE_CACHE.get(`user-${user}`);
      if (loggedInSession && loggedInSession !== sessionID) {
        return new Response("User sudah digunakan di perangkat lain!", { status: 403 });
      }

      // **Simpan session perangkat yang login**
      await env.DATABASE_CACHE.put(`user-${user}`, sessionID);

      return new Response("Login berhasil", {
        headers: {
          "Set-Cookie": `loggedInUser=${user}; path=/;`,
        },
      });
    }
    
    // **🔹 Endpoint untuk login admin**
if (url.pathname === "/login-admin") {
    const username = url.searchParams.get("username");
    const password = url.searchParams.get("password");

    if (username !== adminCredentials.username || password !== adminCredentials.password) {
        return new Response("Login admin gagal!", { status: 403 });
    }

    // Simpan session admin ke KV dengan masa berlaku 1 jam
    await env.DATABASE_CACHE.put(`user-admin`, "active", { expirationTtl: 3600 });

    return new Response("Admin login berhasil", {
        headers: {
            "Set-Cookie": "loggedInUser=admin; path=/; HttpOnly; Max-Age=3600;",
        },
    });
}

    // **🔹 Endpoint untuk logout user**
if (url.pathname === "/logout-user") {
    const cookie = request.headers.get("Cookie") || "";
    const loggedInUser = getCookieValue(cookie, "loggedInUser"); // Ambil user dari cookie
    const userToLogout = url.searchParams.get("user") || loggedInUser; // Prioritaskan query, fallback ke cookie

    if (!userToLogout) {
        return new Response(JSON.stringify({ success: false, message: "User tidak ditemukan" }), {
            headers: { "Content-Type": "application/json" },
            status: 400,
        });
    }

    // **Hapus session ID user dari cache**
    await env.DATABASE_CACHE.delete(`user-${userToLogout}`);

    return new Response(JSON.stringify({ success: true, user: userToLogout, message: `Logout berhasil` }), {
        headers: {
            "Content-Type": "application/json",
            "Set-Cookie": "loggedInUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;", // Hapus cookie
            
        },
    });
}

    // **🔹 Admin Dashboard**
if (url.pathname === "/admin-dashboard") {
    let adminSession = await env.DATABASE_CACHE.get(`user-admin`);

    // Jika session tidak ada tapi cookie masih "admin", anggap login valid
    if (!adminSession && loggedInUser === "admin") {
        await env.DATABASE_CACHE.put(`user-admin`, "active", { expirationTtl: 3600 });
        adminSession = "active";
    }

    if (!adminSession || loggedInUser !== "admin") {
        return new Response("Akses ditolak! Hanya admin yang bisa mengakses halaman ini.", { status: 403 });
    }

    const keys = await env.DATABASE_CACHE.list();
    const users = keys.keys.filter(k => k.name.startsWith("user-")).map(k => k.name.replace("user-", ""));

    return new Response(adminDashboard(users, env), { headers: { "Content-Type": "text/html" } });
}

    // **🔹 Logout Admin**
    if (url.pathname === "/logout-admin") {
      await env.DATABASE_CACHE.delete(`user-admin`);

      return new Response("Admin telah logout", {
         headers: {
           "Set-Cookie": "loggedInUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;",
           "Location": "/"
         },
      });
    }

    // **🔹 Cek apakah user valid**
    if (!loggedInUser || (loggedInUser !== "admin" && !(await env.DATABASE_CACHE.get(`user-${loggedInUser}`)))) {
      return new Response(loginPage(), { headers: { "Content-Type": "text/html" } });
    }

    // **🔹 Akses halaman lain**
    if (url.pathname === "/") return handleHome();
    if (url.pathname === "/search") return handleSearch(request, env);
    if (url.pathname === "/inout") return handleSearch_inout(request, env);
    if (url.pathname === "/stok") return handleSearch_stok(request, env);
    if (url.pathname === "/list") return handleSearch_list(request, env);
    if (url.pathname === "/reset") return resetSemuaCache(env);
    if (url.pathname === "/last-update") {
      const lastUpdate = await env.DATABASE_CACHE.get("lastUpdate");
      return new Response(lastUpdate || "-", { status: 200 });
    }

    return notFound();
  },
};