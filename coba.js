const { exec } = require("child_process");
const fs = require('fs');
const { askQuestion, updateUserLogin} = require('./function/script');
const loginpustu = JSON.parse(fs.readFileSync('./lib/userlogin.json', 'utf-8'));
const email = loginpustu[0].email;
const password = loginpustu[0].password;
const { spawn } = require("child_process");

function startProcess(file) {
    console.log("Menjalankan script...");
    if(file == "pendaftaran"){
        console.log('proses pendaftaran');
        const process = spawn("node", ["input.js"], { stdio: "inherit" });
        process.on("exit", (code) => {
            console.log(`Script berhenti dengan kode: ${code}, memulai ulang...`);
            startProcess(file);
        });
        process.on("error", (err) => {
            console.error(`Terjadi error: ${err.message}`);
            startProcess(file);
        });
    }else if (file == "pelayanan"){
        const process = spawn("node", ["pelayanan.js"], { stdio: "inherit" });
        process.on("exit", (code) => {
            console.log(`Script berhenti dengan kode: ${code}, memulai ulang...`);
            startProcess(file);
        });
        process.on("error", (err) => {
            console.error(`Terjadi error: ${err.message}`);
            startProcess(file);
        });
    }else{
        console.log('Input yang anda masukan salah');
    }
}
(async () => {
    try {
        if (loginpustu[0].email === '') {
            console.log('==================================');
            console.log("Masukan data login terlebih dahulu");
            console.log('==================================');
            const emailLogin = await askQuestion('Masukkan Email: ');
            const passwordLogin = await askQuestion('Masukkan Password: ');
            updateUserLogin(emailLogin, passwordLogin);

            // Restart aplikasi setelah login
            console.log('[INFO] Silahkan memulai ulang aplikasi dengan ketik npm start / tombol panah atas');
            process.exit(1); // Keluar agar dapat restart otomatis dari cmd

        } else {
            console.log('========================================================');
            console.log('SELAMAT DATANG, ANDA AKAN MELAKUKAN PENDAFTARAN/LAYANAN?');
            console.log('========================================================');
            console.log('[1] Pendaftaran');
            console.log('[2] Layanan');

            let action;
            let statusValid = true;
            while (statusValid) {
                action = await askQuestion('Masukan Angka/Jenis Layanan: ');
                if (action.toLowerCase() === 'pendaftaran' || action === '1') {
                    statusValid = false;
                    startProcess("pendaftaran")
                } else if (action.toLowerCase() === 'layanan' || action === '2') {
                    statusValid = false;
                    startProcess("pelayanan")
                } else {
                    console.log('Input yang anda masukan salah');
                }
            }
        }
    } catch (error) {
        console.log('[ALERT] Terjadi kesalahan:', error);
    }
})();