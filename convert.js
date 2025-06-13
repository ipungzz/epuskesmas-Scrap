// Import module 'xlsx'
const xlsx = require('xlsx');
const fs = require('fs');

// Fungsi untuk mengubah file Excel ke JSON
function convertExcelToJson(excelFilePath, jsonFilePath) {
    // Baca file Excel
    const workbook = xlsx.readFile(excelFilePath);

    // Ambil sheet pertama dari workbook
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Konversi sheet menjadi format JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Simpan data JSON ke file
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');

    console.log(`File berhasil dikonversi dari ${excelFilePath} ke ${jsonFilePath}`);
}

// Contoh penggunaan: ganti 'data.xlsx' dan 'output.json' sesuai kebutuhan
const excelFilePath = './import/import.xlsx'; // Path file Excel yang akan dikonversi
const jsonFilePath = './lib/data.json'; // Path file JSON output

convertExcelToJson(excelFilePath, jsonFilePath);
