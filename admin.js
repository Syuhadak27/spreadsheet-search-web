// **🔹 Fungsi mendapatkan nilai cookie**
export function getCookieValue(cookie, key) {
  const match = cookie.match(new RegExp(`${key}=([^;]+)`));
  return match ? match[1] : null;
}

// **🔹 Halaman login user**
export function loginPage() {
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Login</title>
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          height: 100vh; 
          background: linear-gradient(135deg, #667eea, #764ba2); 
          font-family: Arial, sans-serif;
        }
        .login-box {
          width: 320px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          text-align: center;
          transition: transform 0.3s ease-in-out;
        }
        h2 {
          color: white;
          margin-bottom: 15px;
        }
        .tab-buttons {
          display: flex;
          justify-content: space-around;
          margin-bottom: 15px;
        }
        .tab-buttons button {
          flex: 1;
          padding: 10px;
          border: none;
          background: rgba(255, 255, 255, 0.3);
          color: white;
          cursor: pointer;
          transition: 0.3s;
        }
        .tab-buttons button.active {
          background: #4CAF50;
        }
        input {
          display: block;
          width: 100%;
          margin: 10px 0;
          padding: 10px;
          border: 2px solid transparent;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transition: 0.3s;
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        input:focus {
          border-color: #4CAF50;
          background: rgba(255, 255, 255, 0.4);
          outline: none;
        }
        button { 
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 5px;
          background: #4CAF50; 
          color: white; 
          font-weight: bold;
          cursor: pointer; 
          transition: 0.3s;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        button:hover {
          background: #45a049;
        }
        #popup { 
          display: none; 
          position: fixed; 
          top: 50%; 
          left: 50%; 
          transform: translate(-50%, -50%); 
          background: rgba(0, 0, 0, 0.8); 
          color: white; 
          padding: 15px; 
          border-radius: 10px; 
          text-align: center;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }
        #popup.show { opacity: 1; display: block; }
        .hidden { display: none; }
      </style>
    </head>
    <body>
      <div class="login-box">
        <h2>Login</h2>
        <div class="tab-buttons">
          <button id="userTab" class="active" onclick="switchTab('user')">User</button>
          <button id="adminTab" onclick="switchTab('admin')">Admin</button>
        </div>

        
        <div id="userLogin">
          <input type="text" id="usernameInput" placeholder="Masukkan nama Anda.." oninput="validateUsername()">
          <p id="errorText" style="color: red; display: none;">Gunakan huruf kecil semua</p>
          <button onclick="checkLogin()">Login</button>
        </div>

        <div id="adminLogin" class="hidden">
          <input type="text" id="adminUsername" placeholder="Admin Username">
          <input type="password" id="adminPassword" placeholder="Password">
          <button onclick="checkAdminLogin()">Login Admin</button>
        </div>
      </div>

      <div id="popup"></div>

      <script>
        function validateUsername() {
  const usernameInput = document.getElementById("usernameInput");
  const errorText = document.getElementById("errorText");

  if (/[A-Z]/.test(usernameInput.value)) {
    errorText.style.display = "block"; // Tampilkan pesan error
  } else {
    errorText.style.display = "none"; // Sembunyikan jika tidak ada huruf kapital
  }
}
      
      
        function showPopup(message) {
          const popup = document.getElementById("popup");
          popup.textContent = message;
          popup.classList.add("show");

          setTimeout(() => {
            popup.classList.remove("show");
          }, 3000);
        }

        function checkLogin() {
          const username = document.getElementById("usernameInput").value.trim();
          fetch("/login-user?user=" + encodeURIComponent(username))
            .then(response => {
              if (response.ok) {
                window.location.href = "/";
              } else {
                showPopup("Akses Ditolak!");
              }
            });
        }

        function checkAdminLogin() {
          const username = document.getElementById("adminUsername").value.trim();
          const password = document.getElementById("adminPassword").value.trim();
          fetch(\`/login-admin?username=\${encodeURIComponent(username)}&password=\${encodeURIComponent(password)}\`)
            .then(response => {
              if (response.ok) {
                window.location.href = "/admin-dashboard";
              } else {
                showPopup("Login admin gagal!");
              }
            });
        }

        function switchTab(role) {
          document.getElementById("userLogin").classList.toggle("hidden", role !== "user");
          document.getElementById("adminLogin").classList.toggle("hidden", role !== "admin");
          document.getElementById("userTab").classList.toggle("active", role === "user");
          document.getElementById("adminTab").classList.toggle("active", role === "admin");
        }
      </script>
    </body>
    </html>
  `;
}

// **🔹 Halaman dashboard admin**
// Fungsi untuk admin dashboard dengan tampilan log
export function adminDashboard(users, env) {
  // Jika env tersedia, ambil log pencarian
  const logPromise = env ? getSearchLogs(env) : Promise.resolve([]);
  
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Admin Dashboard</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          background: linear-gradient(135deg, #2193b0, #6dd5ed); 
          text-align: center; 
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
        }
        .dashboard-container {
          width: 90%;
          max-width: 1000px;
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          margin-bottom: 20px;
        }
        h2 {
          color: #007bff;
        }
        .user-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          padding: 10px;
        }
        .user-card {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        button { 
          background: #f44336; 
          color: white; 
          border: none; 
          padding: 8px 12px; 
          cursor: pointer; 
          border-radius: 5px;
          transition: 0.3s;
        }
        button:hover { background: #d32f2f; }
        .logout-btn {
          background: #007bff;
          margin-top: 15px;
          padding: 10px;
          width: 100%;
        }
        #popup { 
          display: none; 
          position: fixed; 
          top: 50%; 
          left: 50%; 
          transform: translate(-50%, -50%); 
          background: rgba(0, 0, 0, 0.8); 
          color: white; 
          padding: 15px; 
          border-radius: 10px; 
          text-align: center;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }
        #popup.show { opacity: 1; display: block; }
        
        /* Styles untuk tabel log */
        .logs-container {
          width: 90%;
          max-width: 1000px;
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .logs-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .logs-table th, .logs-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .logs-table th {
          background-color: #f2f2f2;
          color: #333;
        }
        .logs-table tr:hover {
          background-color: #f5f5f5;
        }
        .tab-container {
          margin-bottom: 20px;
        }
        .tab-buttons {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        .tab-btn {
          background: #eee;
          border: none;
          padding: 10px 20px;
          margin: 0 5px;
          cursor: pointer;
          border-radius: 5px 5px 0 0;
          color: #333;
        }
        .tab-btn.active {
          background: #007bff;
          color: white;
        }
        .tab-content {
          display: none;
        }
        .tab-content.active {
          display: block;
        }
        .filter-container {
          margin-bottom: 15px;
          display: flex;
          justify-content: space-between;
        }
        .search-input {
          padding: 8px;
          width: 60%;
          border-radius: 5px;
          border: 1px solid #ddd;
        }
        .filter-dropdown {
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #ddd;
        }
        .action-btn {
          padding: 8px 15px;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-left: 5px;
        }
        .refresh-btn {
          background: #4CAF50;
        }
        .delete-btn {
          background: #f44336;
        }
        .action-container {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
        }
        .loading {
          display: none;
          margin: 20px 0;
          text-align: center;
          font-style: italic;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="tab-container">
        <div class="tab-buttons">
          <button class="tab-btn active" onclick="openTab('users-tab')">Pengguna</button>
          <button class="tab-btn" onclick="openTab('logs-tab')">Log Pencarian</button>
        </div>
      </div>
      
      <div id="users-tab" class="tab-content active">
        <div class="dashboard-container">
          <h2>Admin Dashboard - Pengguna Aktif</h2>
          <div class="user-list">
            ${users.map(user => `
              <div class="user-card" id="user-${user}">
                <p><strong>${user}</strong></p>
                <button onclick="logoutUser('${user}')">Logout</button>
              </div>
            `).join("")}
          </div>
          <button class="logout-btn" onclick="window.location.href='/logout-admin'">Logout Admin</button>
        </div>
      </div>
      
      <div id="logs-tab" class="tab-content">
        <div class="logs-container">
          <h2>Admin Dashboard - Log Pencarian</h2>
          
          <div class="filter-container">
            <input type="text" id="searchInput" class="search-input" placeholder="Filter pencarian..." onkeyup="filterLogs()">
            <select id="userFilter" class="filter-dropdown" onchange="filterLogs()">
              <option value="">Semua Pengguna</option>
              <!-- User options akan diisi saat halaman dimuat -->
            </select>
          </div>
          
          <div class="action-container">
            <button class="action-btn refresh-btn" onclick="refreshLogs()">Refresh</button>
            <button class="action-btn delete-btn" onclick="deleteLogs()">Hapus Semua Log</button>
          </div>
          
          <div id="loading" class="loading">Mengambil data log...</div>
          
          <table class="logs-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Pengguna</th>
                <th>Kata Kunci</th>
              </tr>
            </thead>
            <tbody id="logsTableBody">
              <!-- Log data akan diisi di sini -->
            </tbody>
          </table>
        </div>
      </div>

      <div id="popup"></div>

      <script>
        // Simpan log data dalam variabel global
        let logData = [];

        // Fungsi ini dipanggil saat halaman dimuat
        window.onload = async function() {
          if (document.getElementById('logs-tab')) {
            await fetchLogs();
          }
        };

        function showPopup(message) {
          const popup = document.getElementById("popup");
          popup.textContent = message;
          popup.classList.add("show");

          setTimeout(() => {
            popup.classList.remove("show");
          }, 3000);
        }

        async function logoutUser(user) {
          const response = await fetch(\`/logout-user?user=\${user}\`);
          const data = await response.json();

          if (data.success) {
            showPopup(data.message);
            document.getElementById("user-" + data.user).remove();
          }
        }
        
        function openTab(tabId) {
          // Hide all tab contents
          const tabContents = document.getElementsByClassName("tab-content");
          for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove("active");
          }
          
          // Deactivate all tab buttons
          const tabButtons = document.getElementsByClassName("tab-btn");
          for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].classList.remove("active");
          }
          
          // Show the selected tab content and activate the button
          document.getElementById(tabId).classList.add("active");
          event.currentTarget.classList.add("active");
        }
        
        function filterLogs() {
          const searchText = document.getElementById("searchInput").value.toLowerCase();
          const userFilter = document.getElementById("userFilter").value;
          const rows = document.getElementById("logsTableBody").getElementsByTagName("tr");
          
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const username = row.getAttribute("data-username");
            const query = row.getAttribute("data-query").toLowerCase();
            
            const matchesSearch = query.includes(searchText);
            const matchesUser = userFilter === "" || username === userFilter;
            
            if (matchesSearch && matchesUser) {
              row.style.display = "";
            } else {
              row.style.display = "none";
            }
          }
        }
        
        async function fetchLogs() {
          document.getElementById("loading").style.display = "block";
          
          try {
            const response = await fetch('/admin-logs');
            const data = await response.json();
            
            if (data.logs) {
              logData = data.logs;
              updateLogsTable();
              updateUserFilter();
            }
          } catch (error) {
            console.error("Error fetching logs:", error);
            showPopup("Error mengambil data log");
          } finally {
            document.getElementById("loading").style.display = "none";
          }
        }
        
        function updateLogsTable() {
          const tableBody = document.getElementById("logsTableBody");
          tableBody.innerHTML = '';
          
          if (logData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Tidak ada data log</td></tr>';
            return;
          }
          
          logData.forEach(log => {
            const row = document.createElement("tr");
            row.setAttribute("data-username", log.username);
            row.setAttribute("data-query", log.query);
            
            row.innerHTML = \`
              <td>\${log.timestamp}</td>
              <td>\${log.username}</td>
              <td>\${log.query}</td>
            \`;
            
            tableBody.appendChild(row);
          });
        }
        
        function updateUserFilter() {
          const userFilter = document.getElementById("userFilter");
          const currentSelection = userFilter.value;
          userFilter.innerHTML = '<option value="">Semua Pengguna</option>';
          
          const usernames = [...new Set(logData.map(log => log.username))];
          usernames.forEach(username => {
            const option = document.createElement("option");
            option.value = username;
            option.textContent = username;
            if (username === currentSelection) {
              option.selected = true;
            }
            userFilter.appendChild(option);
          });
        }
        
        async function refreshLogs() {
          await fetchLogs();
          filterLogs();
          showPopup("Log berhasil diperbarui");
        }
        
        async function deleteLogs() {
          if (!confirm("Anda yakin ingin menghapus semua log pencarian?")) {
            return;
          }
          
          try {
            const response = await fetch('/admin-logs-delete');
            
            if (response.ok) {
              logData = [];
              updateLogsTable();
              updateUserFilter();
              showPopup("Semua log berhasil dihapus");
              await refreshLogs();
            } else {
              const text = await response.text();
              showPopup("Gagal menghapus log: " + text);
            }
          } catch (error) {
            console.error("Error deleting logs:", error);
            showPopup("Error menghapus log");
          }
        }
      </script>
    </body>
    </html>
  `;
}

// Fungsi untuk mengambil semua log dari KV storage
export async function getSearchLogs(env) {
  try {
    // Dapatkan semua kunci log dari KV storage dengan limit lebih tinggi jika diperlukan
    const logsList = await env.LOG_STORAGE.list({ 
      prefix: 'log-',
      limit: 999 // Sesuaikan dengan kebutuhan
    });
    
    // Ambil semua log berdasarkan kunci
    const logPromises = logsList.keys.map(key => 
      env.LOG_STORAGE.get(key.name, { type: "json" })
    );
    
    // Tunggu semua promises selesai
    const logResults = await Promise.all(logPromises);
    
    // Filter null values dan urutkan
    const logs = logResults
      .filter(log => log !== null)
      .sort((a, b) => {
        // Konversi timestamp ke format yang bisa diurutkan
        const dateA = parseIndonesianDate(a.timestamp);
        const dateB = parseIndonesianDate(b.timestamp);
        return dateB - dateA;
      });
      
    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    return [];
  }
}

// Helper function untuk parse format tanggal Indonesia
function parseIndonesianDate(dateStr) {
  try {
    // Format: "DD/MM/YYYY, HH.MM.SS"
    const [datePart, timePart] = dateStr.split(', ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split('.');
    
    return new Date(year, month - 1, day, hour, minute, second);
  } catch (e) {
    console.error("Error parsing date:", e);
    return new Date(0); // Fallback ke epoch
  }
}

// Handler untuk endpoint admin-logs
export async function handleAdminLogs(env) {
  try {
    const logs = await getSearchLogs(env);
    console.log(typeof logs, logs);
    
    return new Response(JSON.stringify({ 
      success: true, 
      logs: logs 
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// Fungsi untuk menyimpan log pencarian
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
