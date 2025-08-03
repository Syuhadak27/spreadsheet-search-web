# 📂 Gudang Database Bot

Gudang Database Bot adalah aplikasi berbasis Cloudflare Workers yang memungkinkan pencarian data dengan cepat langsung dari **Google Sheets**. 🚀  

## ✨ **Fitur Utama**
✅ **Pencarian Data** – Cari data di Google Sheets dengan mudah.  
✅ **Mode INOUT** – Menampilkan hasil pencarian dalam format berbeda.  
✅ **Cache Otomatis** – Data disimpan dalam cache selama **12 jam** untuk respons lebih cepat.  
✅ **Tampilan Responsif** – Didukung **light mode** & **dark mode**.  
✅ **Salin Data Cepat** – Klik hasil pencarian untuk menyalin ke clipboard.  
✅ **Desain Sederhana & Elegan** – Menggunakan CSS modern dengan efek hover.  
✅ **Mengubah data menjadi gambar** - Mengubah hasil menjadi sebuah gambar yg siap di unduh.

---

## 💁 **Struktur Proyek**
```
📂 project-root/
├── cache.js        # Menyimpan & mengambil cache hasil pencarian
├── home.js         # Halaman utama dengan form pencarian
├── index.js        # Routing utama untuk menangani request
├── inout.js        # Logika pencarian untuk mode INOUT
├── routes.js       # Menangani endpoint yang tidak ditemukan (404)
├── search.js       # Logika pencarian utama
├── sheets.js       # Mengambil data dari Google Sheets menggunakan API
├── templates.js    # Template HTML untuk tampilan hasil pencarian
```

---

## 🛠️ **Cara Instalasi & Menjalankan**
### **1⃣ Clone Repository**
```sh
git clone https://github.com/username/repository.git
cd repository
```

### **2⃣ Konfigurasi config**
Buka file `config.js` dan masukkan:
```js
export const config = {
  GOOGLE_API_KEY: "",
  BOT_TOKEN: "",
  CHANNEL_ID: "-100xxx",
  KIRIM_LOG: "telegram",
  SPREADSHEET_ID: "",
  USER_WEB: ["user1", "user2", "user3"],
  ADMIN_USERNAME: "admin",
  ADMIN_PASWORD: "admin"
};
```

### **3⃣ Deploy ke Cloudflare Workers**
```sh
npm install -g wrangler
wrangler login
wrangler publish
```

---

## 🖥️ **Cara Menggunakan**
1⃣ **Buka halaman utama**  
   - **Masukkan kata kunci** untuk mencari data.  
   - Tekan tombol **"Cari"** untuk hasil biasa.  
   - Tekan tombol **"INOUT"** untuk format berbeda.  

2⃣ **Klik hasil pencarian** untuk menyalinnya ke clipboard.  

3⃣ **Pencarian otomatis lebih cepat** karena data dicache selama 12 jam.  

---

## 🛠️ **Teknologi yang Digunakan**
- **Cloudflare Workers** – Serverless computing  
- **Google Sheets API** – Mengambil data spreadsheet  
- **JavaScript (ES6)** – Backend & frontend logic  
- **HTML + CSS** – Tampilan UI responsif  



## 🐝 **Lisensi**
Proyek ini menggunakan lisensi **MIT** – bebas digunakan dan dimodifikasi.  

---


