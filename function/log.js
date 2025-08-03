export async function logSearch(env, request, query) {
    const timestamp = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    const cookie = request.headers.get("Cookie") || "";
    const loggedInUser = getCookieValue(cookie, "loggedInUser") || "Guest";

    const logData = {
        query: query,
        username: loggedInUser,
        timestamp: timestamp
    };

    // Simpan log ke KV Storage dengan masa berlaku 12 jam
    const logKey = `log-${Date.now()}`;
    await env.LOG_STORAGE.put(logKey, JSON.stringify(logData), { expirationTtl: 43200 });
}

// ✅ Fungsi untuk mengambil nilai cookie tertentu
function getCookieValue(cookie, name) {
    const match = cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
}
