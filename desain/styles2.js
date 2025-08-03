export const styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

 /* ========== Global Styles ========== */
        body {
          font-family: Arial, Helvetica, sans-serif;
          text-align: center;          
          background: #e3f2fd;
          color: #333;
          margin: 0;
          padding-top: 150px;
        }
                  .clock-container {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-top: 10px;
    padding: 8px;
    background-color: transparent;
    color: lime;
    border-radius: 8px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
}


        h1 { color: #007bff; font-size: 18px; }
        hr { border: none; height: 2px; background: #007bff; margin: 10px 0; }

        /* ========== Header & Search Bar ========== */
        .fixed-header {
          position: fixed;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 400px;
          background-color: #e3f2fd; /* Pastikan background solid */
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Gunakan bayangan lebih solid */
          border-radius: 10px;
          padding: 10px;
          z-index: 500;
          border: 2px solid #007bff;
        }
        
        .image-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    margin: 10px;
    text-align: center;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
.image-card img {
    max-width: 100%;
    height: auto;
}
        
        
        table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
            font-size: 11px; /* Ukuran font default */
        }
        td, th {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        .controls {
            margin-bottom: 10px;
        }
        button {
            font-size: 16px;
            padding: 5px 10px;
            margin: 2px;
            cursor: pointer;
        }

        footer {
          font-size: 12px;
          margin-top: 6px;
          padding: 5px 0;
          text-align: center;
          color: #666;
        }

        time {
          font-size: 12px;
          margin-top: 6px;
          padding: 5px 0;
          text-align: right;
          color: #666;
        }
        loged {
          font-size: 12px;
          margin-top: 6px;
          padding: 5px 0;
          text-align: center;
          color: #666;
        }



        input {
          padding: 10px;
          width: 90%;
          max-width: 400px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        /* ========== Result Container ========== */
        .results-container {
          margin-top: 120px;
          width: 90%;
          max-width: 400px;
          background: #e3f2fd;
          border-radius: 10px;
          border: 2px solid #007bff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          padding: 15px;
          max-height: auto;
          overflow-y: auto;
          margin-left: auto;
          margin-right: auto;
          text-align: left;
        }
                  /* Tambahan CSS untuk banner teks berjalan */
          .banner {
            background: linear-gradient(90deg, #4CAF50, #2196F3);
            color: white;
            font-weight: bold;
            padding: 5px 0;
            text-align: center;
            font-size: 14px;
            border-radius: 5px;
            margin-bottom: 10px;
          }

          marquee {
            font-size: 14px;
            font-weight: bold;
          }



        .result-card {
          background: #E3F2FD;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 5px;
          box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
          cursor: pointer;
          color: #121212;
        }

/* ========== Tab Buttons ========== */
.btn-container {
  
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 tombol per baris */
  gap: 7px;
  justify-content: center;
  margin-top: 10px;
  background: #f0f0f0;
  border-radius: 8px;
  padding: 3px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

button {
  width: 70px;  /* Ubah lebar */
  height: 24px;  /* Ubah tinggi */
  font-size: 10px; /* Ubah ukuran font */
  padding: 8px 12px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-weight: normal;
  text-align: left;
  flex-grow: 1;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: none;
  margin: 2px;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

button.active {
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
  transform: translateY(1px);
}

/* Warna latar tab */
.btn-clear { background: #ffcccb; color: #8b0000; }
.btn-download { background:rgba(7, 120, 248, 0.86); color:rgb(210, 211, 218); }
.btn-logout { background:rgba(236, 3, 3, 0.86); color:rgb(210, 211, 218); }
.btn-search { background: #90ee90; color: #006400; }
.btn-inout { background: #ffd700; color: #b8860b; }
.btn-export { background: #add8e6; color: #00008b; }

/* Efek aktif tab */
.btn-clear:active, .btn-search:active, .btn-inout:active, .btn-export:active {
  transform: scale(0.95);
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .btn-container {
    background: #2a2a2a;
  }
  
  .btn-clear { background: #8b0000; color: #fff; }
  .btn-search { background: #006400; color: #fff; }
  .btn-inout { background: #b8860b; color: #fff; }
  .btn-export { background: #00008b; color: #fff; }
}
        
        /* ========== Toast Notification ========== */
        .toast {
          visibility: hidden;
          min-width: 200px;
          top: 10px; /* Atur jarak dari atas */
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          text-align: center;
          border-radius: 5px;
          padding: 10px;
          position: fixed;
          
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          font-size: 14px;
          opacity: 0;
          transition: opacity 0.3s, visibility 0.3s;
        }


        .toast.show {
          visibility: visible;
          opacity: 1;
        }

        /* ========== Dark Mode Support ========== */
        @media (prefers-color-scheme: dark) {
          body { background: #121212; color: #ddd; }
          .fixed-header, .results-container { 
            background: #1e1e1e; 
            box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
            color: #ffffff;
          }
          h1, hr { color: #8ab4f8; background: #8ab4f8; }
          input { background: #2c2c2c; color: #fff; border: 1px solid #555; }
          input::placeholder { color: #bbb; }
          .result-card { background: #2c2c2c; color:rgb(15, 1, 1); }
          .btn-clear { background: darkred; }
          .btn-search { background: darkgreen; }
          .btn-inout { background: linear-gradient(45deg, darkgoldenrod, darkorange); }
        }
        .search-container {
          text-align: center;
          margin: 20px;
        }
        
        /* ========== Custom Pop-up Alert ========== */
        .custom-alert {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border: 2px solid blue;
          color: black;
          padding: 10px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          font-weight: bold;
          display: none;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
          z-index: 10000;
        }

        /* Dark Mode */
        @media (prefers-color-scheme: dark) {
          .custom-alert {
            background: black;
            color: white;
            border: 2px solid cyan;
          }
        }

 
          /* Tambahan CSS untuk iframe dan hasil pencarian Bing */
          .bing-container {
            width: 100%;
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
  
          .bing-frame {
            width: 100%;
            height: 600px;
            border: none;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
  
          .bing-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
            display: flex;
            align-items: center;
          }
  
          .bing-title img {
            height: 24px;
            margin-right: 8px;
          }
  
          .bing-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100px;
            color: #666;
          }
  
          .spinner {
            width: 24px;
            height: 24px;
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top-color: #007FFF;
            animation: spin 1s ease-in-out infinite;
            margin-right: 10px;
          }
  
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }



`;