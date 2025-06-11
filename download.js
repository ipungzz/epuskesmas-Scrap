const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');

const app = express();
const port = 3654;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let dataReceived = false;  // flag global untuk cek apakah data sudah diterima

function startCloudflared() {
    return new Promise((resolve, reject) => {
        const cloudflared = spawn('cloudflared', ['tunnel', '--url', `http://localhost:${port}`]);

        let linkFound = false;

        // Baca stdout
        const rlStdout = readline.createInterface({
            input: cloudflared.stdout,
            crlfDelay: Infinity
        });

        rlStdout.on('line', (line) => {
            console.log(`[cloudflared STDOUT] ${line}`);
            checkForLink(line);
        });

        // Baca stderr
        const rlStderr = readline.createInterface({
            input: cloudflared.stderr,
            crlfDelay: Infinity
        });

        rlStderr.on('line', (line) => {
            checkForLink(line);
        });

        function checkForLink(line) {
            const urlMatch = line.match(/https:\/\/[a-zA-Z0-9\-]+\.trycloudflare\.com/);
            if (urlMatch && !linkFound) {
                linkFound = true;
                resolve(urlMatch[0]);
                rlStdout.close();
                rlStderr.close();
            }
        }

        cloudflared.on('close', (code) => {
            if (!linkFound) reject(new Error(`cloudflared exited with code ${code} sebelum link ditemukan`));
        });

        const interval = setInterval(() => {
            if (!linkFound) {
                //console.log("Menunggu link dari cloudflared...");
            } else {
                clearInterval(interval);
            }
        }, 2000);
    });
}

app.get('/', (req, res) => {
    res.send("HELLO WORLD!")
});

app.post('/upload', (req, res) => {
    const data = req.body;
    const filePath = path.join(__dirname, '/lib/received_data.json');

    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            res.status(500).send("Gagal menyimpan file");
            process.exit(1);
            return;
        }
        console.log("Berhasil menerima data");
        dataReceived = true;  // tandai bahwa data sudah diterima

        setTimeout(() => {
            process.exit(0);
        }, 2000);
    });
});

app.listen(port, async () => {
    console.log(`Downloader aktif di port ${port}`);

    try {
        const publicUrl = await startCloudflared();
        console.log("\n=== LINK PUBLIK ANDA ===");
        console.log(`${publicUrl}/upload\n`);

        // Mulai log menunggu data
        const waitInterval = setInterval(() => {
            if (!dataReceived) {
                console.log("Menunggu data diterima...");
            } else {
                clearInterval(waitInterval);
            }
        }, 2000);

    } catch (err) {
        console.error("Gagal menjalankan cloudflared:", err);
    }
});