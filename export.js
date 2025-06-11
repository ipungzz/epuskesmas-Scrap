const fs = require('fs');
const xlsx = require('xlsx');

// Fungsi untuk mengonversi JSON ke Excel
function jsonToExcel(jsonData, outputFile) {
    // Membuat workbook baru
    const workbook = xlsx.utils.book_new();

    // Mengonversi JSON menjadi worksheet
    const worksheet = xlsx.utils.json_to_sheet(jsonData);

    // Menambahkan worksheet ke workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Data');

    // Menyimpan workbook ke file
    xlsx.writeFile(workbook, outputFile);
}

// Membaca data JSON dari file
const jsonFilePath = './lib/fix.json'; // Ganti dengan path file JSON kamu
const outputExcelPath = './export/export_data.xlsx'; // Nama file output Excel

// Membaca data JSON
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }

    try {
        // Mengonversi string JSON menjadi objek
        const jsonData = JSON.parse(data);

        // Mengonversi JSON ke Excel
        jsonToExcel(jsonData, outputExcelPath);
        console.log(`File Excel berhasil dibuat: ${outputExcelPath}`);
    } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
    }
});