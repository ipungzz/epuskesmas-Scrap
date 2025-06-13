const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { askQuestion } = require('./function/script');

(async () => {
    try {
        // Input link tujuan via askQuestion
        const targetLink = await askQuestion('Paste Link Upload Data disini: ');

        // Baca file JSON lokal
        const filePath = path.join(__dirname, '/lib/data.json');
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Kirim data
        const response = await axios.post(targetLink, jsonData);

        if (response.status === 200) {
            console.log("[INFO] Data berhasil dikirim!");
        } else {
            console.log("Data dikirim, tetapi server mengembalikan status:", response.status);
        }
        setTimeout(() => {
            console.log("[INFO] Menutup aplikasi...");
            process.exit(0);
        }, 1000);
    } catch (error) {
        if (error.response) {
            console.error("Gagal mengirim data:", error.response.status, error.response.data);
        } else {
            console.error("[INFO] "+ error.message);
        }
        setTimeout(() => {
            //console.log("Menutup aplikasi...");
            process.exit(0);
        }, 1000);
    }
})();