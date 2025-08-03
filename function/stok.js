import { styles } from "./func_style";
import { config } from "../config";

//======reset STOK========================================================
export async function resetStokCache(env) {
  if (!env?.DATABASE_CACHE) {
    console.error("❌ KV Database tidak terkonfigurasi");
    return "Gagal: KV tidak tersedia.";
  }

  try {
    // Hapus cache inout dan timestamp
    await env.DATABASE_CACHE.delete("stok_cache");
    await env.DATABASE_CACHE.delete("stok_last_update");

    console.log("✅ Cache stok berhasil direset.");

    // Ambil data terbaru dari Google Sheets
    const sheetId = config.SPREADSHEET_ID;
    const apiKey = config.GOOGLE_API_KEY;
    const newData = await fetchStokData(sheetId, "stok!A2:F", apiKey);

    if (Array.isArray(newData) && newData.length > 0) {
      // Simpan data baru ke cache
      await saveToKV_stok(newData, env);
      console.log("✅ Data stok berhasil diperbarui ke KV.");
      return "Cache stok berhasil diperbarui.";
    } else {
      console.warn("⚠️ Tidak ada data baru dari Google Sheets.");
      return "Cache stok direset, tetapi tidak ada data baru.";
    }
  } catch (error) {
    console.error("❌ Gagal mereset cache stok:", error);
    return "Gagal mereset cache stok.";
  }
}


async function fetchStokData(sheetId, range, apiKey) {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error("❌ Error mengambil data dari Google Sheets:", error);
    return [];
  }
}

//================simpan cache stok============= 
export async function saveToKV_stok(data, env) {
  await env.DATABASE_CACHE.put("stok_cache", JSON.stringify(data), {
    expirationTtl: 86400, // 12 jam
  });
}

export async function getFromKV_stok(env) {
  const data = await env.DATABASE_CACHE.get("stok_cache");
  return data ? JSON.parse(data) : null;
}

//======== ambil data dari sheet stok================
export async function getCachedData_stok(env) {
  let data = await getFromKV_stok(env);
  if (data) return data;  // ✅ Ambil dari cache jika ada

  const sheetId = config.SPREADSHEET_ID;
  const apiKey = config.GOOGLE_API_KEY;
  const range = "stok!A2:F";

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    data = await response.json();
    await saveToKV_stok(data.values || [], env);  // ✅ Simpan ke cache agar tidak fetch ulang
    return data.values || [];
  } catch (error) {
    console.error("❌ Error mengambil data:", error);
    return [];
  }
}

//========main fungsi===
export async function handleSearch_stok(request, env) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  if (!query) return new Response("Masukkan query!", { status: 400 });

  let data = await getFromKV_stok(env);
  if (!data) {
    data = await getCachedData_stok(env);
    await saveToKV_stok(data, env);
  }

  const keywords = query.toLowerCase().split(" ");
  const results = data.filter(row =>
    keywords.every(keyword => row.some(cell => String(cell).toLowerCase().includes(keyword)))
  );

  let resultHtml = `<style>${styles}</style>

    <div class="results">`;

  if (results.length === 0) {
    resultHtml += `<p class="no-result" style="color: red;">❌ Tidak ada hasil ditemukan.</p>`;
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
          <td onclick="copyToClipboard('${row[1]}')"><b>${row[1]}</b></td>
          <td>${row[0]}</td>
          <td>${row[2]}</td>
          <td>${row[3]}</td>
          <td>${row[4]}</td>
        </tr>`;
    });

    resultHtml += `</tbody></table>`;
  }
  resultHtml += "</div>";

  return new Response(resultHtml, {
    headers: { "Content-Type": "text/html" },
  });
}