const fs = require('fs');
const { exec } = require('child_process');
const readline = require('readline');

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

function runVoting() {
    return new Promise((resolve, reject) => {
        exec('node voting.js', (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`[STDERR] ${stderr}`);
            }
            console.log(`[OUTPUT] ${stdout}`);
            resolve();
        });
    });
}

(async () => {
    while (true) {
        try {
            const jumlah = parseInt(await askQuestion('Masukkan hasil voting yang diinginkan: '), 10);
            if (isNaN(jumlah) || jumlah <= 0) {
                console.error('[ERROR] Masukkan angka valid lebih dari 0');
                continue;  // minta input ulang
            }
            console.log(`Hasil voting yang dimasukkan: ${jumlah}`);

            // Jalankan voting.js sebanyak jumlah kali
            for (let i = 0; i < jumlah; i++) {
                console.log(`[INFO] Menjalankan voting ke-${i + 1}`);
                await runVoting();
            }

            console.log('[INFO] Semua proses voting selesai');
            console.log('-----------------------------');

        } catch (err) {
            console.error('[ERROR]', err);
        }
    }
})();