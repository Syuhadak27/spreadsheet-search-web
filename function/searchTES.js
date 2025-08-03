import { logSearch } from "./log";
import { styles } from "./func_style";
import { config } from "../config";

//============== simpan ke kv=============
export async function saveToKV(data, env) {
    await env.DATABASE_CACHE.put("search_results", JSON.stringify(data), {
      expirationTtl: 86400, // 12 jam
    });
  }
  
  export async function getFromKV(env) {
    const data = await env.DATABASE_CACHE.get("search_results");
    return data ? JSON.parse(data) : null;
  }
//=============ambil dari sheet===========
export async function getCachedData(env, forceUpdate = false) {
  if (!forceUpdate) {
    // 🔹 Cek apakah data sudah ada di cache
    const cachedData = await getFromKV(env);
    if (cachedData) return cachedData; 
  }

  // 🔹 Jika tidak ada cache, ambil data baru dari Google Sheets
  const sheetId = config.SPREADSHEET_ID;
  const apiKey = config.GOOGLE_API_KEY;
  const range = "DATABASE!A2:E";

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();
    await saveToKV(data.values || [], env); // Simpan ke cache

    return data.values || [];
  } catch (error) {
    console.error("❌ Error mengambil data:", error);
    return [];
  }
}

//=============main fungsi=================
export async function handleSearch(request, env) {
    const url = new URL(request.url);
    const query = url.searchParams.get("query");

    if (!query) 
        return new Response("<p style='color: red;'>❌ Masukkan query!</p>", { status: 400 });

    let data = await getCachedData(env); // Ambil data dari cache atau Sheets jika cache kosong

    const keywords = query.toLowerCase().split(" ");
    const results = data.filter(row =>
        keywords.every(keyword => row.some(cell => String(cell).toLowerCase().includes(keyword)))
    );

    let resultHtml = `<style>${styles}</style>
        <div class="results">`;

    if (results.length === 0) {
        resultHtml += "<p style='color: red;'>❌ Tidak ada hasil ditemukan.</p>";
    } else {
        resultHtml += `<table class="search-table">
                        <thead>
                            <tr>
                                <th>Nama Barang</th>
                                <th>Sales</th>
                                <th>Stok</th>
                                <th>Kode</th>
                                <th>Harga</th>
                            </tr>
                        </thead>
                        <tbody>`;

        results.forEach(row => {
            resultHtml += `
            <tr>
                <td ondblclick="insertToSearch('${row[1]}')"><b>${row[1]}</b></td>
                <td>${row[0]}</td>
                <td>${row[2]}</td>
                <td>${row[3]}</td>
                <td>${row[4]}</td>
            </tr>`;
        });

        resultHtml += `</tbody></table>`;
    }
    resultHtml += "</div>";

    // 🔹 Tunda pengiriman log selama 3 detik
    setTimeout(() => logSearch(env, request, query), 3);

    return new Response(resultHtml, {
        headers: { "Content-Type": "text/html" },
    });
}

//========reset==============================================
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
    const sheetId = config.SPREADSHEET_ID;
    const apiKey = config.GOOGLE_API_KEY;
    const newData = await getCachedData(sheetId, "DATABASE!A2:E", "main", apiKey);

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

