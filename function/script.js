const fs = require('fs');
const readline = require('readline');
const fileinput = '\lib/data.json';
const fileoutput = '\lib/fix.json';
const dataUser = '\lib/userlogin.json';
function tinggi(umur, jenisKelamin) {
        let heights;
    
        // Daftar tinggi badan berdasarkan jenis kelamin dan kelompok umur
        if (jenisKelamin === 'Laki-laki') {
                if (umur < 16) {
                        heights = [115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130]; // Usia di bawah 16 tahun
                } else if (umur <= 60) {
                        heights = [165,166,167,168,169,170,171,172,173,174,175]; // Usia 16-60 tahun
                } else {
                        heights = [155,156,157,158,159,160,162,162,163,164,165,166,167,168,169,170]; // Usia di atas 60 tahun
                }
        } else if (jenisKelamin === 'Perempuan') {
                if (umur < 16) {
                        heights = [115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130]; // Usia di bawah 15 tahun
                } else if (umur <= 60) {
                        heights = [156,157,158,159,160,161,162,163,164,165,166,167]; // Usia 16-60 tahun
                } else {
                        heights = [155,156,157,158,159,160,162,162,163,164,165,166,167]; // Usia di atas 60 tahun
                }
        } else {
                console.log("Jenis kelamin tidak valid. Masukkan 'Laki-laki' atau 'Perempuan'.");
                return null;
        }
    
        // Mengambil indeks acak dari array tinggi badan yang sesuai
        const randomIndex = Math.floor(Math.random() * heights.length);
        // Mengembalikan tinggi badan acak
        return heights[randomIndex];
    }


//menghitung berat badan ideal sesuai umur dan jenis kelamin
function beratIdeal(tinggi, umur, jenisKelamin) {
    let beratIdeal;

    // Menghitung berat ideal berdasarkan jenis kelamin menggunakan Broca's Formula
    if (jenisKelamin === 'Laki-laki') {
        beratIdeal = (tinggi - 100) - ((tinggi - 100) * 0.1); // Rumus untuk pria
    } else if (jenisKelamin === 'Perempuan') {
        beratIdeal = (tinggi - 100) - ((tinggi - 100) * 0.15); // Rumus untuk wanita
    } else {
        console.log("Jenis kelamin tidak valid. Masukkan 'Laki-laki' atau 'Perempuan'.");
        return null;
    }

    // Koreksi berat ideal berdasarkan umur
    if (umur < 16) {
        beratIdeal *= 0.90; // Kurangi 10% jika umur kurang dari 16 tahun (15 tahun kebawah)
    } else if (umur >= 16 && umur < 60) {
        // Tidak ada koreksi khusus untuk dewasa
    } else if (umur >= 60) {
        beratIdeal *= 1.05; // Tambah 5% jika umur lebih dari 60 tahun
    }

    // Pembulatan ke dua angka desimal
    return Math.round(beratIdeal * 100) / 100;
}

//menghitung selisih umur
function calculateAge(umur) {
    try {
        // Validasi format input dan pisahkan tanggal, bulan, dan tahun
        const [day, month, year] = umur.split('-').map(Number);

        // Pastikan nilai day, month, dan year valid
        if (!day || !month || !year || day < 1 || day > 31 || month < 1 || month > 12 || year < 0) {
            throw new Error("Format tanggal tidak valid. Harus dalam format DD-MM-YYYY.");
        }

        // Membuat objek Date untuk tanggal lahir
        const birth = new Date(year, month - 1, day); // Bulan - 1 karena bulan di JavaScript dimulai dari 0
        const today = new Date(); // Tanggal hari ini

        // Periksa apakah tanggal lahir valid (misalnya, 30 Februari tidak ada)
        if (birth > today || birth.getDate() !== day || birth.getMonth() !== (month - 1)) {
            throw new Error("Tanggal lahir tidak valid.");
        }

        let age = today.getFullYear() - birth.getFullYear(); // Selisih tahun
        const monthDiff = today.getMonth() - birth.getMonth(); // Selisih bulan

        // Jika bulan saat ini lebih kecil dari bulan lahir, atau sama tetapi tanggal hari ini lebih kecil, kurangi umur 1
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age; // Mengembalikan umur
    } catch (error) {
        return error.message; // Mengembalikan pesan error jika ada masalah
    }
}


// Fungsi untuk memperbarui status menjadi '200' dan menambahkannya ke file fix.json
const updateJsonStatusSucces = (nama, nik, jeniskelamin, tanggallahir, umur, tinggi, berat) => {
    try {
        // Membaca file JSON dari file input
        const data = JSON.parse(fs.readFileSync(fileinput, 'utf-8'));

        // Mencari data berdasarkan NIK dan memperbarui status jika ditemukan
        const entry = data.find(item => item.nik === nik);
        if (entry) {
            entry.id = entry.id;
            entry.nokertas = entry.nokertas;
            entry.nik = nik;
            entry.nama = nama;
            entry.jeniskelamin = jeniskelamin;
            entry.tanggallahir = tanggallahir;
            entry.umur = umur,
            entry.tinggi = tinggi,
            entry.berat = berat,
            
            entry.status = "200"; // Mengubah status menjadi '200' (berhasil)

            // Menyimpan kembali perubahan ke file input
            fs.writeFileSync(fileinput, JSON.stringify(data, null, 2), 'utf-8');
            console.log(`Data dengan NIK ${nik} berhasil diperbarui statusnya menjadi 200 di file ${fileinput}.`);
            
            // Menambahkan data yang di-update ke file fix.json
            addToFileFix(entry);
        } else {
            //console.log(`Data dengan NIK ${nik} tidak ditemukan di file ${fileinput}.`);
        }
    } catch (error) {
        //console.error("Terjadi kesalahan dalam pembacaan atau penulisan file:", error);
    }
};

// Fungsi untuk memperbarui status menjadi '404' dan menambahkannya ke file fix.json
const updateJsonStatusNotFound = (nik) => {
    try {
        // Membaca file JSON dari file input
        const data = JSON.parse(fs.readFileSync(fileinput, 'utf-8'));

        // Mencari data berdasarkan NIK dan memperbarui status jika ditemukan
        const entry = data.find(item => item.nik === nik);
        if (entry) {
            entry.status = "404"; // Mengubah status menjadi '404' (tidak ditemukan)

            // Menyimpan kembali perubahan ke file input
            fs.writeFileSync(fileinput, JSON.stringify(data, null, 2), 'utf-8');
            //console.log(`Data dengan NIK ${nik} berhasil diperbarui statusnya menjadi 404 di file ${fileinput}.`);
            
            // Menambahkan data yang di-update ke file fix.json
            addToFileFix(entry);
        } else {
            //console.log(`Data dengan NIK ${nik} tidak ditemukan di file ${fileinput}.`);
        }
    } catch (error) {
        console.error("Terjadi kesalahan dalam pembacaan atau penulisan file:", error);
    }
};

const updateJsonStatusRegion = (nik) => {
    try {
        // Membaca file JSON dari file input
        const data = JSON.parse(fs.readFileSync(fileinput, 'utf-8'));

        // Mencari data berdasarkan NIK dan memperbarui status jika ditemukan
        const entry = data.find(item => item.nik === nik);
        if (entry) {
            entry.status = "405"; // Mengubah status menjadi '404' (tidak ditemukan)

            // Menyimpan kembali perubahan ke file input
            fs.writeFileSync(fileinput, JSON.stringify(data, null, 2), 'utf-8');
            //console.log(`Data dengan NIK ${nik} berhasil diperbarui statusnya menjadi 404 di file ${fileinput}.`);
            
            // Menambahkan data yang di-update ke file fix.json
            addToFileFix(entry);
        } else {
            //console.log(`Data dengan NIK ${nik} tidak ditemukan di file ${fileinput}.`);
        }
    } catch (error) {
        console.error("Terjadi kesalahan dalam pembacaan atau penulisan file:", error);
    }
};

const updateJsonStatusBPJS = (nik) => {
    try {
        // Membaca file JSON dari file input
        const data = JSON.parse(fs.readFileSync(fileinput, 'utf-8'));

        // Mencari data berdasarkan NIK dan memperbarui status jika ditemukan
        const entry = data.find(item => item.nik === nik);
        if (entry) {
            entry.status = "Tidak aktif"; // Mengubah status menjadi '404' (tidak ditemukan)

            // Menyimpan kembali perubahan ke file input
            fs.writeFileSync(fileinput, JSON.stringify(data, null, 2), 'utf-8');
            //console.log(`Data dengan NIK ${nik} berhasil diperbarui statusnya menjadi 404 di file ${fileinput}.`);
            
            // Menambahkan data yang di-update ke file fix.json
            addToFileFix(entry);
        } else {
            //console.log(`Data dengan NIK ${nik} tidak ditemukan di file ${fileinput}.`);
        }
    } catch (error) {
        console.error("Terjadi kesalahan dalam pembacaan atau penulisan file:", error);
    }
};

const updateUserLogin = (email, password) =>{
    try{
        const data = JSON.parse(fs.readFileSync(dataUser, 'utf-8'));
        const entry = data.find(item => item.email === "");
        if(entry){
            entry.email = `${email}`;
            entry.password = `${password}`;
            fs.writeFileSync(dataUser, JSON.stringify(data, null, 2), 'utf-8');
            console.log(`[INFO] Berhasil menambahkan data email "${email}" dan password "${password}" ke database`);
        }else{
            console.log("gagal")
        }
    }catch (error) {
        console.error("Terjadi kesalahan dalam pembacaan atau penulisan file:", error);
    }
}

// Fungsi untuk menambahkan data yang telah di-update ke file fix.json
const addToFileFix = (updatedEntry) => {
    try {
        // Membaca file JSON dari file fix.json (jika belum ada, buat array kosong)
        let outputData = [];
        if (fs.existsSync(fileoutput)) {
            outputData = JSON.parse(fs.readFileSync(fileoutput, 'utf-8'));
        }

        // Memeriksa apakah data dengan NIK sudah ada dalam outputData
        const exists = outputData.some(item => item.nik === updatedEntry.nik);
        if (!exists) {
            // Menambahkan data yang di-update ke array outputData
            outputData.push(updatedEntry);

            // Menyimpan kembali data yang diperbarui ke file fix.json
            fs.writeFileSync(fileoutput, JSON.stringify(outputData, null, 2), 'utf-8');
            //console.log(`Data berhasil ditambahkan ke file ${fileoutput}.`);
        } else {
            //console.log(`Data dengan NIK ${updatedEntry.nik} sudah ada di file ${fileoutput}. Tidak ada yang ditambahkan.`);
        }
    } catch (error) {
        console.error("Terjadi kesalahan dalam pembacaan atau penulisan file output:", error);
    }
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fungsi untuk meminta input dari pengguna
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}
    
    module.exports = {
        tinggi,
        beratIdeal,
        calculateAge,
        updateJsonStatusSucces,
        updateJsonStatusNotFound,
        addToFileFix,
        updateJsonStatusRegion,
        updateJsonStatusBPJS,
        askQuestion,
        rl,
        updateUserLogin,
    };