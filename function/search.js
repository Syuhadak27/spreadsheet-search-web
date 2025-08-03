import { logSearch } from "./log";
import { logSearch_telegram } from "./log_tele";
import { styles } from "./func_style";
import { config } from "../config";

const SEND_LOG = config.KIRIM_LOG;


//============== Simpan & Ambil dari KV =============
export async function saveToKV(data, env) {
  await env.DATABASE_CACHE.put("search_results", JSON.stringify(data), {
    expirationTtl: 604800, // 1 minggu
  });
}

export async function getFromKV(env) {
  const data = await env.DATABASE_CACHE.get("search_results");
  return data ? JSON.parse(data) : null;
}


//============= Ambil dari Google Sheets ===========
export async function getCachedData(env, forceUpdate = false) {
    if (!forceUpdate) {
        const cachedData = await getFromKV(env);
        if (cachedData) return cachedData;
    }

    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.SPREADSHEET_ID}/values/DATABASE!A2:E?key=${config.GOOGLE_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        await saveToKV(data.values || [], env);
        return data.values || [];
    } catch (error) {
        console.error("❌ Error mengambil data:", error);
        return [];
    }
}

//============= Fungsi Pencarian ==================
export async function handleSearch(request, env) {
    const url = new URL(request.url);
    const query = url.searchParams.get("query");
    const isFormSubmit = url.searchParams.get("isFormSubmit") === "true"; // Parameter baru
    
    if (!query) return new Response("<p style='color: red;'>❌ Masukkan query!</p>", { status: 400 });

    let data = await getCachedData(env);
    const keywords = query.toLowerCase().split(" ");
    const results = data.filter(row => keywords.every(keyword => row.some(cell => String(cell).toLowerCase().includes(keyword))));

    let resultHtml = `<style>${styles}</style><div class='results'>`;
    resultHtml += results.length === 0
        ? "<p style='color: red;'>❌ Tidak ada hasil ditemukan.</p>"
        : `<table class='search-table'><thead><tr><th>Nama Barang</th><th>⚡</th><th>🧾</th><th>Kode</th><th>Harga</th></tr></thead><tbody>
            ${results.map(row => `<tr><td ondblclick="insertToSearch('${row[1]}')"><b>${row[1]}</b></td><td>${row[0]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${row[4]}</td></tr>`).join('')}
        </tbody></table>`;
    resultHtml += "</div>";
    
    const response = new Response(resultHtml, { headers: { "Content-Type": "text/html" } });
    
    // Hanya kirim log jika dari tombol submit
    if (isFormSubmit) {
        if (SEND_LOG === "telegram") await logSearch_telegram(env, request, query);
        else if (SEND_LOG === "kv") await logSearch(env, request, query);
    }
    
    return response;
}

//============= Reset Cache ==================
export async function resetCacheUtama(env) {
    if (!env?.DATABASE_CACHE) {
        console.error("❌ KV Database tidak terkonfigurasi");
        return "Gagal: KV tidak tersedia.";
    }

    try {
        // Hapus cache pencarian dan timestamp
        await env.DATABASE_CACHE.delete("search_results");
        console.log("✅ Cache utama berhasil direset.");

        // Ambil data terbaru dari Google Sheets
        const newData = await getCachedData(env, true);

        if (Array.isArray(newData) && newData.length > 0) {
            await saveToKV(newData, env);
            console.log("✅ Data utama berhasil diperbarui ke KV.");
            return "Cache utama berhasil diperbarui.";
        } else {
            console.warn("⚠️ Tidak ada data baru dari Google Sheets.");
            return "Cache utama direset, tetapi tidak ada data baru.";
        }
    } catch (error) {
        console.error("❌ Gagal mereset cache utama:", error);
        return "Gagal mereset cache utama.";
    }
}