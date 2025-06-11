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
        console.log("Data berhasil dikirim:", response.data);
        setTimeout(() => {
            console.log("Berhasil Upload Data, menutup aplikasi...");
            process.exit(0);
        }, 1000);
    } catch (error) {
        //console.error("Gagal mengirim data:", error.message);
        setTimeout(() => {
            console.log("Berhasil Upload Data, menutup aplikasi...");
            process.exit(0);
        }, 1000);
    }
})();