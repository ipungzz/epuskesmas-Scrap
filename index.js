const { exec } = require("child_process");
const fs = require('fs');
const { askQuestion, updateUserLogin } = require('./function/script');
const loginpustu = JSON.parse(fs.readFileSync('./lib/userlogin.json', 'utf-8'));
const email = loginpustu[0].email;
const password = loginpustu[0].password;

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
                    console.log('[INFO] Sedang menjalankan program input pendaftaran');
                    exec("node input.js", (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.error(`Stderr: ${stderr}`);
                            return;
                        }
                        console.log(stdout);
                    });
                } else if (action.toLowerCase() === 'layanan' || action === '2') {
                    statusValid = false;
                    console.log('[INFO] Sedang menjalankan program pelayanan');

                    // Execute pelayanan.js and capture all output (stdout and stderr)
                    const child = exec("node pelayanan.js", (error, stdout, stderr) => {
                        // Handle any errors from the child process
                        if (error) {
                            console.error(`[ERROR] Terjadi kesalahan saat menjalankan pelayanan.js: ${error.message}`);
                            process.exit()
                            return;
                        }
                        // If there's anything in stderr, log it as errors
                        if (stderr) {
                            console.error(`[ERROR] Pelayanan.js stderr: ${stderr}`);
                            
                        }
                        // Print stdout output
                        if (stdout) {
                            console.log(`[OUTPUT] Pelayanan.js stdout: ${stdout}`);
                        }
                    });

                    // Listen for additional logs from the child process
                    child.stdout.on('data', (data) => {
                        console.log(data.toString().trim()); // Trim to remove extra newlines or whitespace
                    });
                    
                    child.stderr.on('data', (data) => {
                        console.log(data.toString().trim()); // Same for stderr
                    });
                } else {
                    console.log('Input yang anda masukan salah');
                }
            }
        }
    } catch (error) {
        console.log('[ALERT] Terjadi kesalahan:', error);
    }
})();

// Kode untuk restart aplikasi ketika exit
process.on('exit', (code) => {
    if (code === 1) {
        exec("node index.js", (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return;
            }
            console.log(stdout);
        });
    }
});
