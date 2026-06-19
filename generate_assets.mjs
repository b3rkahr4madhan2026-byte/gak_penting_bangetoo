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
    for (let i = 0; i < apiKeys.length; i++) {
        const apiKey = apiKeys[i];
        try {
            console.log(`Mencoba API Stitch ke-${i + 1}...`);
            
            // Opsi A: Jika SDK menggunakan class Client/Stitch
            // Ini adalah cara paling standar di SDK modern agar API key berganti di setiap loop
            const client = new stitch.Stitch({ apiKey: apiKey }); 
            const project = await client.createProject("KresnaAi_images");
            
            /* // Opsi B: Jika SDK Anda tidak pakai "new stitch.Stitch" melainkan inisialisasi fungsi:
            stitch.initializeApp({ apiKey: apiKey });
            const project = await stitch.createProject("KresnaAi_images");
            */

            const screen = await project.generate(prompt);
            
            // Ambil URL Gambar
            // Jika screen.getImage() error, coba langsung console.log(screen) untuk melihat strukturnya
            const imageUrl = await screen.getImage(); 
            
            console.log("SUCCESS:" + imageUrl);
            return; 
            
        } catch (error) {
            console.warn(`API ke-${i + 1} gagal. Error: ${error.message}`);
        }
    }
    
    console.error("ERROR: Mohon maaf, sistem mengalami gangguan.");
    process.exit(1);
}

generateImage();
