import { stitch } from "@google/stitch-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Update Path .env ke folder constant
const envPath = path.join(__dirname, 'constant', '.env');

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.error("ERROR: .env tidak ditemukan di " + envPath);
    process.exit(1);
}

const prompt = process.argv[2] || "A minimalist clean user interface";

async function generateImage() {
    try {
        if (!process.env.STITCH_API_KEY) {
            console.error("ERROR: STITCH_API_KEY tidak ditemukan di .env");
            process.exit(1);
        }
        
        // Memanggil API Stitch Google
        const project = await stitch.createProject("Telegram_Assets_Engine");
        const screen = await project.generate(prompt);
        const imageUrl = await screen.getImage(); 
        
        // Output standar 'SUCCESS:' agar mudah di-parsing oleh Python
        console.log("SUCCESS:" + imageUrl);
    } catch (error) {
        console.error("ERROR:" + error.message);
    }
}

generateImage();