import { styles } from "./func_style";
import { config } from "../config";

//==============================cache===================================================  
export async function saveToKV_inout(data, env) {
  await env.DATABASE_CACHE.put("inout_cache", JSON.stringify(data), {
    expirationTtl: 604800, // 1 minggu
  });
}

export async function getFromKV_inout(env) {
  if (!env.DATABASE_CACHE) {
      console.error("DATABASE_CACHE tidak tersedia!");
      return null;
  }
  const data = await env.DATABASE_CACHE.get("inout_cache");
  return data ? JSON.parse(data) : null;
}

//=======reset cache INOUT==================================================================

export async function resetInoutCache(env) {
  if (!env?.DATABASE_CACHE) {
    console.error("❌ KV Database tidak terkonfigurasi");
    return "Gagal: KV tidak tersedia.";
  }

  try {
    // Hapus cache inout dan timestamp
    await env.DATABASE_CACHE.delete("inout_cache");
    await env.DATABASE_CACHE.delete("inout_last_update");

    console.log("✅ Cache inout berhasil direset.");

    // Ambil data terbaru dari Google Sheets
    const sheetId = config.SPREADSHEET_ID;
    const apiKey = config.GOOGLE_API_KEY;
    const newData = await fetchInoutData(sheetId, "inout!A2:F", apiKey);

    if (Array.isArray(newData) && newData.length > 0) {
      // Simpan data baru ke cache
      await saveToKV_inout(newData, env);
      console.log("✅ Data inout berhasil diperbarui ke KV.");
      return "Cache inout berhasil diperbarui.";
    } else {
      console.warn("⚠️ Tidak ada data baru dari Google Sheets.");
      return "Cache inout direset, tetapi tidak ada data baru.";
    }
  } catch (error) {
    console.error("❌ Gagal mereset cache inout:", error);
    return "Gagal mereset cache inout.";
  }
}


async function fetchInoutData(sheetId, range, apiKey) {
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


//==========ambi data dari sheet inout========================================================
export async function getCachedData_inout(env) {
  let data = await getFromKV_inout(env);  // 🔍 Cek cache lebih dulu
  if (data) return data;                  // ✅ Gunakan cache jika ada

  // ❌ Jika tidak ada di cache, ambil dari Google Sheets
  const sheetId = config.SPREADSHEET_ID;
  const apiKey = config.GOOGLE_API_KEY;
  const range = "inout!A2:F";

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    data = await response.json();
    await saveToKV_inout(data.values || [], env);  // ✅ Simpan ke cache
    return data.values || [];
  } catch (error) {
    console.error("❌ Error mengambil data:", error);
    return [];
  }
}

//===============main inout=====
export async function handleSearch_inout(request, env) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  if (!query) return new Response("Masukkan query!", { status: 400 });

  let data = await getFromKV_inout(env);
  if (!data) {
    data = await getCachedData_inout(env);
    await saveToKV_inout(data, env);
  }

  const keywords = query.toLowerCase().split(" ");
  const results = data.filter(row =>
    keywords.every(keyword => row.some(cell => String(cell).toLowerCase().includes(keyword)))
  );

  if (results.length === 0) {
    return new Response("<p style='color: red;'>❌ Tidak ada hasil ditemukan.</p>", {
      headers: { "Content-Type": "text/html" },
    });
  }

  let totalMasuk = 0;
  let totalKeluar = 0;
  let sumByName = {};

  results.forEach(row => {
    let masuk = parseInt(row[3]?.replace(/\D/g, ""), 10) || 0;
    let keluar = parseInt(row[4]?.replace(/\D/g, ""), 10) || 0;
    let name = row[5]?.trim() || "Tanpa Nama";

    totalMasuk += masuk;
    totalKeluar += keluar;
    sumByName[name] = (sumByName[name] || 0) + keluar;
  });

  const totalTersisa = totalMasuk - totalKeluar;

  let tableHtml = `<style>${styles}</style>

    <div class="summary">
      <p>🟢 Masuk: ${totalMasuk} pcs • 🔴 Keluar: ${totalKeluar} pcs • 🟡 Tersisa: ${totalTersisa} pcs</p>
    </div>

    <table>
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Nama Barang</th>
          <th>Sales</th>
          <th>In</th>
          <th>Out</th>
          <th>User</th>
        </tr>
      </thead>
      <tbody>
  `;

  results.forEach(row => {
    tableHtml += `
      <tr>
        <td>${row[0]}</td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td>${row[3]}</td>
        <td>${row[4]}</td>
        <td>${row[5]}</td>
      </tr>
    `;
  });

  tableHtml += `</tbody></table>`;

  return new Response(tableHtml, {
    headers: { "Content-Type": "text/html" },
  });
}