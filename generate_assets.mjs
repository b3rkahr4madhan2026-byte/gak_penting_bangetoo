import { stitch } from "@google/stitch-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envPath = path.join(__dirname, 'constant', '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.error("ERROR:  Mohon maaf, sistem mengalami gangguan);
    process.exit(1);
}

// 1. Mengumpulkan semua API key ke dalam array
const apiKeys = [];
for (let i = 1; i <= 15; i++) {
    const key = process.env[`API_STITCH_${i}`];
    if (key) apiKeys.push(key);
}

if (apiKeys.length === 0) {
    console.error("ERROR: Sistem mengalami ganguan");
    process.exit(1);
}

const prompt = process.argv[2] || "A minimalist clean user interface";

async function generateImage() {
    // 2. Melakukan perulangan untuk mencoba setiap API
    for (const apiKey of apiKeys) {
        try {
            console.log("Mencoba API Stitch..."); // Opsional: log status
            
            // Konfigurasi menggunakan apiKey saat ini
            // Asumsi: stitch.init atau cara autentikasi dilakukan di sini
            // (Sesuaikan dengan cara SDK Anda menginisialisasi apiKey tersebut)
            
            const project = await stitch.createProject("KresnaAi_images", { apiKey });
            const screen = await project.generate(prompt);
            const imageUrl = await screen.getImage(); 
            
            console.log("SUCCESS:" + imageUrl);
            return; // Berhenti setelah berhasil
            
        } catch (error) {
            console.warn("Proses gagal coba ulangi kembali... Error: " + error.message);
            // Lanjut ke iterasi berikutnya (API kunci ke-n+1)
        }
    }
    
    // Jika semua API gagal
    console.error("ERROR: Mohon maaf, sistem mengalami gangguan.");
    process.exit(1);
}

generateImage();
