const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Log file disimpan disini (misalnya untuk viewer)
const logFile = path.join(__dirname, 'log.txt');

// Simulasi endpoint ambil log (bisa sesuaikan nanti)
app.get('/ambil', (req, res) => {
  let logs = [];

  if (fs.existsSync(logFile)) {
    logs = fs.readFileSync(logFile, 'utf8').split('\n').filter(line => line);
  }

  res.json({ logs });
});

// Endpoint untuk jalankan program
app.get('/run', (req, res) => {
  const program = req.query.program;

  let fileToRun = '';

  if (program === 'input') {
    fileToRun = 'input.js';
  } else if (program === 'pelayanan') {
    fileToRun = 'pelayanan.js';
  } else {
    return res.status(400).json({ message: 'Program tidak ditemukan' });
  }

  const child = spawn('node', [fileToRun]);

  child.stdout.on('data', (data) => {
    console.log(`[${fileToRun}]: ${data}`);
    fs.appendFileSync(logFile, data);
  });

  child.stderr.on('data', (data) => {
    console.error(`[ERROR ${fileToRun}]: ${data}`);
    fs.appendFileSync(logFile, `ERROR: ${data}`);
  });

  child.on('close', (code) => {
    console.log(`${fileToRun} selesai dengan kode: ${code}`);
  });

  res.json({ message: `${fileToRun} sedang dijalankan...` });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});