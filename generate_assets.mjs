import { stitch } from "@google/stitch-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Pastikan path ke .env sudah benar
const envPath = path.join(__dirname, 'constant', '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.error("ERROR: Mohon maaf, sistem mengalami gangguan. File konfigurasi tidak ditemukan.");
    process.exit(1);
}

// 1. Mengumpulkan semua API key ke dalam array
const apiKeys = [];
for (let i = 1; i <= 15; i++) {
    const key = process.env[`API_STITCH_${i}`];
    if (key) apiKeys.push(key);
}

if (apiKeys.length === 0) {
    console.error("ERROR: Sistem mengalami gangguan. API Key tidak ditemukan.");
    process.exit(1);
}

// Prompt otomatis yang dikirim oleh Model AI (Default jika kosong)
const prompt = process.argv[2] || "A minimalist clean user interface";

async function generateImage() {
    // 2. Melakukan perulangan untuk mencoba setiap API jika yang sebelumnya gagal
    for (let i = 0; i < apiKeys.length; i++) {
        const apiKey = apiKeys[i];
        try {
            console.log(`Mencoba API Stitch index ke-${i + 1}...`);
            
            // TRIK: Set env variable global secara dinamis agar dibaca oleh SDK internal Google Stitch
            process.env.STITCH_API_KEY = apiKey; 
            process.env.GOOGLE_API_KEY = apiKey; // Beberapa versi SDK Google menggunakan fallback ini

            // Jika SDK Anda mendukung inisialisasi client (Disarankan jika cara di atas gagal):
            // const client = new stitch.StitchClient({ apiKey: apiKey });
            // const project = await client.createProject("KresnaAi_images");
            
            // Jalankan generator
            const project = await stitch.createProject("KresnaAi_images");
            const screen = await project.generate(prompt);
            const imageUrl = await screen.getImage(); 
            
            console.log("SUCCESS:" + imageUrl);
            return; // Berhenti dan keluar dari fungsi jika sukses
            
        } catch (error) {
            console.warn(`API ke-${i + 1} gagal. Mengalihkan ke API berikutnya... Error: ${error.message}`);
            // Loop otomatis berlanjut ke API key berikutnya
        }
    }
    
    // Jika semua 15 API key dicoba dan semuanya gagal
    console.error("ERROR: Mohon maaf, sistem mengalami gangguan teknis pada seluruh server gambar.");
    process.exit(1);
}

generateImage();
