import { config } from '../config';
const TELEGRAM_BOT_TOKEN = config.BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = config.CHANNEL_ID;

export async function logSearch_telegram(env, request, query) {
    const timestamp = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    const ipAddress = request.headers.get("CF-Connecting-IP") || "Unknown IP";
    const userAgent = request.headers.get("User-Agent") || "Unknown Device";
    const cookie = request.headers.get("Cookie") || "";
    
    // 🔥 Ambil nama user dari cookie
    const loggedInUser = getCookieValue(cookie, "loggedInUser") || "Guest";

    // 🔥 Parsing User-Agent untuk dapatkan detail perangkat
    const deviceInfo = getDeviceInfo(userAgent);

    const message = `
<b>📌 LOG PENCARIAN</b>
<blockquote>🕒 <b>Waktu:</b> ${timestamp}
🌍 <b>IP:</b> ${ipAddress}
📱 <b>Device:</b> ${deviceInfo}</blockquote>
👤 <b>User:</b> ${loggedInUser}
🔍 <b>Query:</b> <code>${query}</code>
    `;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = {
        chat_id: TELEGRAM_CHANNEL_ID,
        text: message,
        parse_mode: "HTML",
    };

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

// ✅ Fungsi untuk mengambil nilai cookie tertentu
function getCookieValue(cookie, name) {
    const match = cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
}

function getDeviceInfo(userAgent) {
    let os = "Unknown OS";
    let browser = "Unknown Browser";
    let device = "Unknown Device";
    let brand = "";

    // Deteksi OS
    if (/windows/i.test(userAgent)) os = "Windows";
    else if (/macintosh|mac os x/i.test(userAgent)) os = "MacOS";
    else if (/android/i.test(userAgent)) {
        os = "Android";
        
        // Deteksi merek ponsel Android
        if (/samsung/i.test(userAgent)) brand = "Samsung";
        // Xiaomi detection dengan pola yang lebih lengkap
        else if (/xiaomi|mi |miui|redmi|poco/i.test(userAgent)) brand = "Xiaomi";
        // Redmi specific detection dengan penulisan spesifik Redmi
        else if (/HM NOTE|Redmi Note|Redmi[0-9]|M200|M2004|M2006|M2007|M2010|M2012|M2101|M2102|M2103|M2104|M2105|M2106|22011|22031|23021/i.test(userAgent)) brand = "Redmi";
        else if (/huawei/i.test(userAgent)) brand = "Huawei";
        else if (/oppo/i.test(userAgent)) brand = "OPPO";
        else if (/vivo/i.test(userAgent)) brand = "Vivo";
        else if (/realme/i.test(userAgent)) brand = "Realme";
        else if (/oneplus/i.test(userAgent)) brand = "OnePlus";
        else if (/asus|zenfone/i.test(userAgent)) brand = "Asus";
        else if (/nokia/i.test(userAgent)) brand = "Nokia";
        else if (/lenovo/i.test(userAgent)) brand = "Lenovo";
        else if (/sony|xperia/i.test(userAgent)) brand = "Sony";
        else if (/lg/i.test(userAgent)) brand = "LG";
        else if (/motorola|moto/i.test(userAgent)) brand = "Motorola";
        else if (/infinix/i.test(userAgent)) brand = "Infinix";
        else if (/tecno/i.test(userAgent)) brand = "TECNO";
        
        // Tambahkan brand ke device jika terdeteksi
        if (brand) device = brand;
    }
    else if (/iphone|ipad|ipod/i.test(userAgent)) {
        os = "iOS";
        device = "Apple";
    }
    else if (/linux/i.test(userAgent)) os = "Linux";

    // Deteksi Browser
    if (/chrome/i.test(userAgent) && !/edg|opr/i.test(userAgent)) browser = "Chrome";
    else if (/firefox/i.test(userAgent)) browser = "Firefox";
    else if (/safari/i.test(userAgent) && !/chrome|edg|opr/i.test(userAgent)) browser = "Safari";
    else if (/edg/i.test(userAgent)) browser = "Edge";
    else if (/opera|opr/i.test(userAgent)) browser = "Opera";
    else if (/ucbrowser/i.test(userAgent)) browser = "UC Browser";
    else if (/miuibrowser/i.test(userAgent)) browser = "MIUI Browser";
    else if (/samsungbrowser/i.test(userAgent)) browser = "Samsung Browser";

    // Jika merek belum terdeteksi namun os adalah Android atau iOS
    if (!device || device === "Unknown Device") {
        device = os === "Android" ? "Android Device" : (os === "iOS" ? "iOS Device" : device);
    }

    return `${device} - ${os} - ${browser}`;
}


// ✅ Fungsi Parsing User-Agent dengan deteksi merek ponsel
function getDeviceInfoKOMPLIT(userAgent) {
    // Default values
    const info = {
        os: "Unknown OS",
        browser: "Unknown Browser",
        deviceType: "Unknown",
        brand: "",
        model: "",
        deviceName: "Unknown Device"
    };

    // OS Detection
    if (/windows nt/i.test(userAgent)) {
        info.os = "Windows";
        info.deviceType = /windows phone|mobile/i.test(userAgent) ? "Mobile" : "Laptop/PC";
        
        // Windows device brands
        const winBrands = {
            asus: "ASUS",
            dell: "Dell",
            hp: "HP",
            lenovo: "Lenovo",
            acer: "Acer",
            msi: "MSI",
            microsoft: "Microsoft",
            surface: ["Microsoft", "Surface"],
            alienware: ["Dell", "Alienware"],
            razer: "Razer",
            xiaomi: "Xiaomi",
            huawei: "Huawei"
        };
        
        for (const [pattern, brand] of Object.entries(winBrands)) {
            if (new RegExp(pattern, "i").test(userAgent)) {
                if (Array.isArray(brand)) {
                    info.brand = brand[0];
                    info.model = brand[1];
                } else {
                    info.brand = brand;
                }
                break;
            }
        }
    } 
    else if (/(macintosh|mac os x)/i.test(userAgent)) {
        info.os = "MacOS";
        info.brand = "Apple";
        
        if (/iphone|ipad|ipod/i.test(userAgent)) {
            info.deviceType = /ipad/i.test(userAgent) ? "Tablet" : "Mobile";
            
            // Apple mobile devices
            if (/iphone/i.test(userAgent)) {
                const modelMatch = userAgent.match(/iphone\s(\d+)/i);
                info.model = modelMatch ? `iPhone ${modelMatch[1]}` : "iPhone";
            } 
            else if (/ipad/i.test(userAgent)) {
                if (/ipad pro/i.test(userAgent)) info.model = "iPad Pro";
                else if (/ipad air/i.test(userAgent)) info.model = "iPad Air";
                else if (/ipad mini/i.test(userAgent)) info.model = "iPad Mini";
                else info.model = "iPad";
            }
        } else {
            info.deviceType = "Laptop/PC";
            // Mac models
            const macModels = {
                "macbook air": "MacBook Air",
                "macbook pro": "MacBook Pro",
                "macbook": "MacBook",
                "imac": "iMac",
                "mac mini": "Mac Mini",
                "mac studio": "Mac Studio",
                "mac pro": "Mac Pro"
            };
            
            for (const [pattern, model] of Object.entries(macModels)) {
                if (new RegExp(pattern, "i").test(userAgent)) {
                    info.model = model;
                    break;
                }
            }
        }
    }
    else if (/android/i.test(userAgent)) {
        info.os = "Android";
        info.deviceType = /mobile/i.test(userAgent) ? "Mobile" : "Tablet";
        
        // Android device detection
        const androidBrands = {
            // Xiaomi/Redmi/POCO
            "xiaomi|mi |miui|redmi|poco": {
                brand: "Xiaomi",
                models: {
                    "Redmi Note 10S|M2101K7[AB][GYI]": "Redmi Note 10S",
                    "Redmi Note 10 Pro|M2101K6[AB][GI]": "Redmi Note 10 Pro",
                    "Redmi Note 10|M2101K7AG": "Redmi Note 10",
                    "Xiaomi 11T|2107113SG|2107113SI": "Xiaomi 11T",
                    "Redmi Note \\d+": (match) => match[0],
                    "Mi \\d+": (match) => match[0],
                    "POCO [A-Z0-9]+": (match) => match[0],
                    "Mi Pad \\w+": (match) => {
                        info.deviceType = "Tablet";
                        return match[0];
                    }
                }
            },
            // Samsung
            "samsung": {
                brand: "Samsung",
                models: {
                    "SM-T\\d+": (match) => {
                        info.deviceType = "Tablet";
                        return `Galaxy Tab ${match[1]}`;
                    },
                    "SM-N\\d+": (match) => `Galaxy Note ${match[1]}`,
                    "SM-S\\d+": (match) => `Galaxy S${match[1].charAt(0)}`,
                    "SM-A\\d+": (match) => `Galaxy A${match[1]}`
                }
            },
            // Other brands
            "huawei": "Huawei",
            "oppo": "OPPO",
            "vivo": "Vivo",
            "realme": "Realme",
            "oneplus": "OnePlus",
            "asus|zenfone": "Asus",
            "nokia": "Nokia",
            "lenovo": "Lenovo",
            "sony|xperia": "Sony",
            "lg": "LG",
            "motorola|moto": "Motorola",
            "infinix": "Infinix",
            "tecno": "TECNO",
            "blackberry": "BlackBerry"
        };
        
        for (const [pattern, brandInfo] of Object.entries(androidBrands)) {
            if (new RegExp(pattern, "i").test(userAgent)) {
                if (typeof brandInfo === "string") {
                    info.brand = brandInfo;
                } else {
                    info.brand = brandInfo.brand;
                    
                    // Check for specific models
                    for (const [modelPattern, modelHandler] of Object.entries(brandInfo.models)) {
                        const modelMatch = userAgent.match(new RegExp(modelPattern, "i"));
                        if (modelMatch) {
                            info.model = typeof modelHandler === "function" 
                                ? modelHandler(modelMatch) 
                                : modelHandler;
                            break;
                        }
                    }
                }
                break;
            }
        }
    }
    else if (/linux/i.test(userAgent)) {
        info.os = "Linux";
        info.deviceType = /mobile/i.test(userAgent) ? "Mobile" : "Laptop/PC";
    }
    else if (/chrome os/i.test(userAgent)) {
        info.os = "Chrome OS";
        info.deviceType = "Laptop/PC";
        info.brand = "Chromebook";
    }

    // Browser Detection
    const browsers = {
        "chrome(?!.*edg|.*opr)": "Chrome",
        "firefox": "Firefox",
        "safari(?!.*chrome|.*edg|.*opr)": "Safari",
        "edg": "Edge",
        "opera|opr": "Opera",
        "ucbrowser": "UC Browser",
        "miuibrowser": "MIUI Browser",
        "samsungbrowser": "Samsung Browser",
        "silk": "Amazon Silk",
        "vivaldi": "Vivaldi",
        "yandex": "Yandex Browser"
    };
    
    for (const [pattern, name] of Object.entries(browsers)) {
        if (new RegExp(pattern, "i").test(userAgent)) {
            info.browser = name;
            break;
        }
    }

    // Build device name
    if (info.brand && info.model) {
        info.deviceName = `${info.brand} ${info.model}`;
    } else if (info.brand) {
        info.deviceName = info.brand;
    } else if (info.os === "Android") {
        info.deviceName = "Android Device";
    } else if (info.os === "iOS") {
        info.deviceName = info.model || "iOS Device";
    } else if (info.deviceType === "Laptop/PC") {
        info.deviceName = info.os.includes("Windows") ? "PC" : info.os + " Computer";
    }

    // Return both structured data and formatted string
    return {
        ...info,
        toString() {
            return `${info.deviceName} (${info.deviceType}) - ${info.os} - ${info.browser}`;
        }
    };
}