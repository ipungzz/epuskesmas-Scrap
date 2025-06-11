const { spawn } = require("child_process");

function startProcess() {
    console.log("Menjalankan script...");
    const process = spawn("node", ["input.js"], { stdio: "inherit" });

    process.on("exit", (code) => {
        console.log(`Script berhenti dengan kode: ${code}, memulai ulang...`);
        startProcess();
    });
    process.on("error", (err) => {
        console.error(`Terjadi error: ${err.message}`);
    });
}

startProcess();