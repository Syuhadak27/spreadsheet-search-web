import { getFromKV, saveToKV } from "./cache";
import { getCachedData } from "./sheets";

export async function handleSearch(request, env) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  if (!query) return new Response("Masukkan query!", { status: 400 });

  let data = await getFromKV(env);
  if (!data) {
    data = await getCachedData();
    await saveToKV(data, env);
  }

  const keywords = query.toLowerCase().split(" ");
  const results = data.filter(row =>
    keywords.every(keyword => row.some(cell => String(cell).toLowerCase().includes(keyword)))
  );

  let resultHtml = `<h1>Hasil untuk "${query}"</h1><hr>`;
  if (results.length === 0) {
    resultHtml += `<p style="color: red;">❌ Tidak ada hasil ditemukan.</p>`;
  } else {
    resultHtml += `<div class="results">`;
    results.forEach(row => {
      resultHtml += `
        <div class="result-card">
          <strong onclick="copyToClipboard('${row[1]}')" style="cursor: pointer; color: inherit;">
            ${row[1]}
          </strong> <br>
            ${row[0]} • ${row[2]} • ${row[3]} • ${row[4]}                     
        </div>`;
    });
    resultHtml += `</div>`;
  }

  return new Response(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hasil Pencarian</title>
<style>
  body {
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 50px;
    background: #f4f7f6;
    color: #333;
  }
  .container {
    max-width: 600px; margin: auto; padding: 20px;
    background: #fff; box-shadow: 0 8px 20px rgba(214, 17, 17, 0.3);
    border-radius: 10px;
  }
  h1 { color: #007bff; }
  font-size: 24px;
  hr { border: none; height: 2px; background: #007bff; margin: 20px 0; }
  .results { text-align: left; }
  .result-card {
    background: #e9f5ff; padding: 10px;
    border-radius: 5px; margin: 30px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
     width: auto;
  }
  a {
    display: block; margin-top: 20px;
    text-decoration: none; color: #007bff; font-weight: bold;
  }
  a:hover { text-decoration: underline; }

  /* DARK MODE */
  @media (prefers-color-scheme: dark) {
    body {
      background: #121212;
      color: #e0e0e0;
    }
    .container {
      background: #1e1e1e;
      box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
    }
    h1 { color: #8ab4f8; }
    hr { background: #8ab4f8; }
    .result-card {
      background: #333;
      color: white;
    }
    a { color: #8ab4f8; }
    a:hover { text-decoration: underline; }
  }
</style>
    </head>
    <body>
      <div class="container">
        <a href="/">🔙 Kembali ke Pencarian</a>
        ${resultHtml}
        <a href="/">🔙 Kembali ke Pencarian</a>
      </div>
    <script>
      function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
          showNotification("Teks berhasil disalin!");
        }).catch(err => {
          console.error("Gagal menyalin teks", err);
        });
      }
    </script>

    </body>
    </html>
  `, { headers: { "Content-Type": "text/html" } });
}

function showNotification(message) {
  let notification = document.createElement("div");
  notification.innerText = message;
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.background = "rgba(0, 0, 0, 0.8)";
  notification.style.color = "white";
  notification.style.padding = "10px 20px";
  notification.style.borderRadius = "5px";
  notification.style.fontSize = "14px";
  notification.style.zIndex = "1000";
  document.body.appendChild(notification);

  setTimeout(() => {
      notification.remove();
  }, 2000); // Notifikasi hilang setelah 2 detik
}