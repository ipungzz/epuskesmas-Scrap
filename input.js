const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const fileinput = './lib/data.json';
const {tinggi, calculateAge, updateJsonStatusSucces, updateJsonStatusNotFound, updateJsonStatusRegion, updateJsonStatusBPJS, beratIdeal, askQuestion, updateUserLogin,rl} = require('./function/script');
const loginpustu = JSON.parse(fs.readFileSync('./lib/userlogin.json', 'utf-8'));
const email = loginpustu[0].email;
const password = loginpustu[0].password;
const url = "https://pasuruan.epuskesmas.id/login";
const url1 = "https://pasuruan.epuskesmas.id/pasien?broadcastNotif=1";
const datuser = JSON.parse(fs.readFileSync(fileinput, 'utf-8'));


//update sementara hanya ada disini wkwk
//cek popup
async function checkPopup(page) {
        try {
            await page.waitForSelector('#swal2-content > span:nth-child(4) > b', { timeout: 5000 });
            const popupText = await page.$eval('#swal2-content > span:nth-child(4) > b', el => el.textContent);
            return popupText.includes('Apakah Pasien Akan Tetap Dilayani Dengan Status Pasien Umum?');
        } catch (error) {
            return false; // Popup tidak ditemukan
        }
    }
    
try {
        (async () => {
            if(!loginpustu[0].email == ""){
                // Launch browser
                const browser = await puppeteer.launch({ headless: false });
                const page = await browser.newPage();
            
                // Go to the desired URL
                await page.goto(url, {
                        waitUntill: "networkidle2"
                }).then(async () =>{
                        //start fungsi login sampai tekan tombol login
                        console.log('[INFO] Sedang Melakukan Login Username & Password');
                        await page.type("#email", email);
                        await page.type("#password", password)
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        await page.click("#login")
                        //end fungsi login
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        console.log('[INFO] Memilih Lokasi Puskes');
                        await page.waitForSelector('#content > div:nth-child(2) > div.panel-body.row > form > div > button');
                        await page.click("#content > div:nth-child(2) > div.panel-body.row > form > div > button")
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        await page.click("#menu_pendaftaran")
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        await page.click("#menu_pendaftaran_pasien")
                        console.log('[INFO] Memilih Fitur Tunda');
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        await page.click("#button_fitur_tunda")
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        await page.click("#modal > div > div > div.modal-form > div:nth-child(1) > div > div > div > span")
                        console.log('[Action] Pilih Tanggal Waktu Tunda, 5 detik berjalan');
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        
                })
                await page.goto(url1, {
                        waitUntill: "networkidle2"
                }).then(async () =>{
                        for (const entry of datuser) {
                            if(entry.status == ""){
                                await new Promise(resolve => setTimeout(resolve, 1000));
                        console.log(`[INFO] Melakukan Input No Nik ${entry.nik}`);
                        await page.type('#form_search > div:nth-child(2) > input', entry.nik); //input data di form search data
                        await page.click('#form_search > button.btn.btn-sm.btn-info', { clickCount: 2 }); //klik button cari
                        await new Promise(resolve => setTimeout(resolve, 3000)); 
                        //mengecek apakah ada data didalam table tersebut
                        const noDataFound = await page.evaluate(() => {
                                const tableCell = document.querySelector('#datatableWrapper > div.table-responsive > table > tbody > tr > td');
                                return tableCell && tableCell.innerText.includes('Data tidak ditemukan');
                        });
                        if (!noDataFound){
                                await page.click('#datatableWrapper > div.table-responsive > table > tbody > tr > td:nth-child(2)', { clickCount: 2 }); //double klik data yang muncul
                                await page.waitForSelector('#button_next');
                                await page.click('#button_next');
                                const isPopupPresent = await checkPopup(page);
                                    if (!isPopupPresent) {
                                        const dataPasien = await page.evaluate(() => {
                                            const elementJK = document.querySelector('#data_pasien'); // Memilih elemen dengan ID #data_pasien
                                            if (elementJK) 
                                            {
                                                    // Mengambil teks dari elemen
                                                    const text = elementJK.innerHTML; // Menggunakan innerHTML untuk menangkap HTML termasuk <br>
                                                    const lines = text.split('<br>'); // Memisahkan setiap baris berdasarkan <br>
                                                    
                                                    // Mencari baris yang mengandung
                                                    const namaLine = lines.find(line => line.includes('Nama:'));
                                                    const jkLine = lines.find(line => line.includes('JK:'));
                                                    const lahirLine = lines.find(line => line.includes('Lahir:'));
                                                    const namaPasien = namaLine ? namaLine.split(':')[1].trim() : null;
                                                    const jenisKelamin = jkLine ? jkLine.split(':')[1].trim() : null;
                                                    const tanggalLahir = lahirLine ? lahirLine.split(':')[1].trim() : null;
                                                    return{jenisKelamin, tanggalLahir, namaPasien}
                                            }
                                        return null; // Kembalikan null jika tidak ditemukan
                                    });

                                const phoneNumber = await page.evaluate(() => {
                                        const inputElement = document.querySelector('#pasien_no_hp');
                                        return inputElement ? inputElement.value : null; // Mengambil nilai dari input
                                });
                                const optionValue = await page.evaluate(() => {
                                    const selectElement = document.querySelector('select[name="Pendaftaran[asuransi_id]"]');
                                    const optionValue = selectElement.options[selectElement.selectedIndex]; // Mendapatkan opsi yang dipilih
                                    return {
                                      text: optionValue.textContent.trim(),
                                      value: optionValue.value,
                                      isBridgingBpjs: optionValue.getAttribute('is_bridgingbpjs'),
                                      showNoAsuransi: optionValue.getAttribute('show_no_asuransi'),
                                      requireNoAsuransi: optionValue.getAttribute('require_no_asuransi'),
                                      selected: optionValue.selected
                                    };
                                  });
                                const statusBpjs = await page.evaluate(() => {
                                    const element = document.querySelector('#data_peserta_bpjs > b:nth-child(10) > span');
                                    return element ? element.innerText : null;
                                });
                                const hasilumur = calculateAge(dataPasien.tanggalLahir);
                                const resulttinggi = tinggi(hasilumur.toString(), dataPasien.jenisKelamin);
                                const resultbadan = beratIdeal(resulttinggi.toString(), hasilumur.toString(), dataPasien.jenisKelamin)
                                console.log (`[INFO] Sedang Memproses Data Status: ${statusBpjs} Nama: ${dataPasien.namaPasien} JK: ${dataPasien.jenisKelamin} Tanggal Lahir: ${dataPasien.tanggalLahir} Umur: ${hasilumur.toString()} dengan rata rata tinggi ${resulttinggi} dan rata rata berat ${resultbadan}`);
                                // Cek jenis kelamin dan jalankan fungsi yang sesuai
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                if(optionValue.text == "BPJS Kesehatan"){
                                    if(statusBpjs == "Sesuai Faskes"){
                                        console.log(`${entry.nik} ${statusBpjs} lanjutkan proses`)
                                        if (dataPasien.jenisKelamin === 'Perempuan') {
                                            await new Promise(resolve => setTimeout(resolve, 1000));
                                            await page.type('#tinggi_badan', resulttinggi.toString());
                                            await page.type('#berat_badan', resultbadan.toString());
                                            if (hasilumur.toString() >= 60) {
                                                    console.log('[INFO] Mendapati data Pasien dengan umur Lansia');
                                                    await page.click('#form_create > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div > div > label:nth-child(2)');
                                                    await page.click('#form_create > div:nth-child(3) > div:nth-child(2) > div:nth-child(5) > div > div:nth-child(2) > label');
                                                    await page.click('#form_create > div:nth-child(3) > div:nth-child(2) > div:nth-child(4) > div > div:nth-child(3) > label');
                                                    console.log('[INFO] Sedang Memasukan Nama Tenaga Medis LILIK MASUDA. AMD. KEP (Perawat)');
                                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                                    await page.type('input[name="dokter_nama"]', 'lilik');
                                                    await new Promise(resolve => setTimeout(resolve, 2000));
                                                    await page.click('.ui-menu-item:first-child');
                                                    //centang bawah dan kirim
                                                    await page.click('#skriningVisual > div.alertDiv.alert-box-success > div > div > div.col-sm-4 > div > label');
                                                    await new Promise(resolve => setTimeout(resolve, 3000));
                                                    await page.click('#row_pelayanan > div > div:nth-child(2) > div > span > div > button');
                                                    await page.waitForSelector('#row_pelayanan > div > div:nth-child(3) > div > span > div:nth-child(9) > button')
                                                    await page.click('#row_pelayanan > div > div:nth-child(3) > div > span > div:nth-child(9) > button'); //pleret konsultasi
                                                            if (phoneNumber === '') {
                                                                    await page.type('#pasien_no_hp','0');
                                                                    await new Promise(resolve => setTimeout(resolve, 2000));
                                                                    await page.click('#button_save');
                                                                    updateJsonStatusSucces(dataPasien.namaPasien, entry.nik, dataPasien.jenisKelamin,dataPasien.tanggalLahir, hasilumur.toString(), resulttinggi.toString(), resultbadan.toString());
                                                                    console.log("[INFO] Berhasil Menambahkan Data:", entry.nik, "Nama: ", dataPasien.namaPasien);
                                                                    await new Promise(resolve => setTimeout(resolve, 2000));
                                                                    await page.goto(url1, {waitUntill: "networkidle2"});
                                                            } else {
                                                                    await new Promise(resolve => setTimeout(resolve, 2000));
                                                                    await page.click('#button_save');
                                                                    updateJsonStatusSucces(dataPasien.namaPasien, entry.nik, dataPasien.jenisKelamin,dataPasien.tanggalLahir, hasilumur.toString(), resulttinggi.toString(), resultbadan.toString());
                                                                    console.log("[INFO] Berhasil Menambahkan Data:", entry.nik, "Nama: ", dataPasien.namaPasien);
                                                                    await new Promise(resolve => setTimeout(resolve, 2000));
                                                                    await page.goto(url1, {waitUntill: "networkidle2"});
                                                            }
                                            }else if(hasilumur.toString() >= 15){
                                                    await page.click('#form_create > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div > div > label:nth-child(2)');
                                                    await page.click('#form_create > div:nth-child(3) > div:nth-child(2) > div:nth-child(5) > div > div:nth-child(2) > label');
                                                    await page.click('#form_create > div:nth-child(3) > div:nth-child(2) > div:nth-child(4) > div > div:nth-child(3) > label');
                                                    console.log('[INFO] Sedang Memasukan Nama Tenaga Medis Siti Mariana (Bidan)');
                                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                                    await page.type('input[name="dokter_nama"]', 'siti maria');
                                                    await new Promise(resolve => setTimeout(resolve, 2000));
                                                    await page.click('.ui-menu-item:first-child');
                                                    await page.click('#skriningVisual > div.alertDiv.alert-box-success > div > div > div.col-sm-4 > div > label');
                                                    await new Promise(resolve => setTimeout(resolve, 2000));
                                                    await page.click('#row_pelayanan > div > div:nth-child(2) > div > span > div > button');
                                                    await new Promise(resolve => setTimeout(resolve, 2000));
                                                    await page.waitForSelector('#row_pelayanan > div > div:nth-child(3) > div > span > div:nth-child(9) > button')
                                                    await page.click('#row_pelayanan > div > div:nth-child(3) > div > span > div:nth-child(9) > button'); //pleret konsultasi
                                                            if (phoneNumber === '') {
                                                                    await page.type('#pasien_no_hp','0');
                                                                    await new Promise(resolve => setTimeout(resolve, 3000));
                                                                    await page.click('#button_save');
                                                                    updateJsonStatusSucces(dataPasien.namaPasien, entry.nik, dataPasien.jenisKelamin,dataPasien.tanggalLahir, hasilumur.toString(), resulttinggi.toString(), resultbadan.toString());
                                                                    await new Promise(resolve => setTimeout(resolve, 4000));
                                                                    console.log("[INFO] Berhasil Menambahkan Data:", entry.nik, "Nama: ", dataPasien.namaPasien);
                                                                    await page.goto(url1, {waitUntill: "networkidle2"});
                                                            } else {
                                                                    await new Promise(resolve => setTimeout(resolve, 3000));
                                                                    await page.click('#button_save');
                                                                    updateJsonStatusSucces(dataPasien.namaPasien, entry.nik, dataPasien.jenisKelamin,dataPasien.tanggalLahir, hasilumur.toString(), resulttinggi.toString(), resultbadan.toString());
                                                                    await new Promise(resolve => setTimeout(resolve, 4000));
                                                                    console.log("[INFO] Berhasil Menambahkan Data:", entry.nik, "Nama: ", dataPasien.namaPasien);
                                                                    await page.goto(url1, {waitUntill: "networkidle2"});
                                                            }
                                            } else{
                                                    console.log('[INFO] Mendapati data pasien dibawah umur 15 Tahun');
                                                    await page.click('#form_create > div:nth-child(3) > div:nth-child(2) > div:nth-child(4) > div > div:nth-child(2) > label');
                                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                                    await page.type('input[name="dokter_nama"]', 'siti mari');
                                                    await new Promise(resolve => setTimeout(resolve, 2000));
                                                    await page.click('.ui-menu-item:first-child');
                                                    await page.click('#skriningVisual > div.alertDiv.alert-box-success > div > div > div.col-sm-4 > div > label');
                                                    await new Promise(resolve => setTimeout(resolve, 3000));
                                                    await page.click('#row_pelayanan > div > div:nth-child(2) > div > span > div > button');
                                                    await new Promise(resolve => setTimeout(resolve, 3000));
                                                    await page.waitForSelector('#row_pelayanan > div > div:nth-child(3) > div > span > div:nth-child(9) > button')
                                                    await page.click('#row_pelayanan > div > div:nth-child(3) > div > span > div:nth-child(9) > button'); //pleret konsultasi
                                                            if (phoneNumber === '') {
                                                                    await page.type('#pasien_no_hp','0');
                                                                    await new Promise(resolve => setTimeout(resolve, 3000));
                                                                    await page.click('#button_save');
                                                                    updateJsonStatusSucces(dataPasien.namaPasien, entry.nik, dataPasien.jenisKelamin,dataPasien.tanggalLahir, hasilumur.toString(), resulttinggi.toString(), resultbadan.toString());
                                                                    await new Promise(resolve => setTimeout(resolve, 4000));
                                                                    console.log("[INFO] Berhasil Menambahkan Data:", entry.nik, "Nama: ", dataPasien.namaPasien);
                                                                    await page.goto(url1, {waitUntill: "networkidle2"});
                                                            } else {
                                                                    await new Promise(resolve => setTimeout(resolve, 3000));
                                                                    await page.click('#button_save');
                                                                    updateJsonStatusSucces(dataPasien.namaPasien, entry.nik, dataPasien.jenisKelamin,dataPasien.tanggalLahir, hasilumur.toString(), resulttinggi.toString(), resultbadan.toString());
                                                                    await new Promise(resolve => setTimeout(resolve, 4000));
                                                                    console.log("[INFO] Berhasil Menambahkan Data:", entry.nik, "Nama: ", dataPasien.namaPasien);
                                                                    await page.goto(url1, {waitUntill: "networkidle2"});
                                                            }
                                            }
                                    }else{
                                        console.log("Pasien Laki-laki")
                                            await page.type('#tinggi_badan', resulttinggi.toString());
                                            await page.type('#berat_badan', resultbadan.toString());
                                            await page.click('#form_create > div:nth-child(3) > div:nth-child(2) > div:nth-child(4) > div > div:nth-child(2) > label');
                                            console.log('[INFO] Sedang Memasukan Nama Tenaga Medis LILIK MASUDA. AMD. KEP (Perawat)');
                                            await new Promise(resolve => setTimeout(resolve, 1000));
                                            await page.type('input[name="dokter_nama"]', 'lilik');
                                            await new Promise(resolve => setTimeout(resolve, 2000));
                                            await page.click('.ui-menu-item:first-child');
                                            await page.click('#skriningVisual > div.alertDiv.alert-box-success > div > div > div.col-sm-4 > div > label');
                                            await new Promise(resolve => setTimeout(resolve, 3000));
                                            await page.click('#row_pelayanan > div > div:nth-child(2) > div > span > div > button'); //rawat jalan
                                            await page.waitForSelector('#row_pelayanan > div > div:nth-child(3) > div > span > div:nth-child(9) > button')
                                            await page.click('#row_pelayanan > div > div:nth-child(3) > div > span > div:nth-child(9) > button'); //pleret konsultasi
                                                    if (phoneNumber === '') {
                                                            await page.type('#pasien_no_hp','0');
                                                            await new Promise(resolve => setTimeout(resolve, 3000));
                                                            await page.click('#button_save');
                                                            updateJsonStatusSucces(dataPasien.namaPasien, entry.nik, dataPasien.jenisKelamin,dataPasien.tanggalLahir, hasilumur.toString(), resulttinggi.toString(), resultbadan.toString());
                                                            await new Promise(resolve => setTimeout(resolve, 4000));
                                                            console.log("[INFO] Berhasil Menambahkan Data:", entry.nik, "Nama: ", dataPasien.namaPasien);
                                                            await page.goto(url1, {waitUntill: "networkidle2"});
                                                    } else {
                                                            await new Promise(resolve => setTimeout(resolve, 3000));
                                                            await page.click('#button_save');
                                                            updateJsonStatusSucces(dataPasien.namaPasien, entry.nik, dataPasien.jenisKelamin,dataPasien.tanggalLahir, hasilumur.toString(), resulttinggi.toString(), resultbadan.toString());
                                                            await new Promise(resolve => setTimeout(resolve, 4000));
                                                            console.log("[INFO] Berhasil Menambahkan Data:", entry.nik, "Nama: ", dataPasien.namaPasien);
                                                            await page.goto(url1, {waitUntill: "networkidle2"});
                                                    }
                                    }
                                    }else{
                                        console.log(`${entry.nik} Pasien Diluar Faskes`);
                                        updateJsonStatusRegion(entry.nik);
                                        await page.goto(url1, {waitUntill: "networkidle2"});
                                    }
                                }else{
                                    console.log(`${entry.nik} bukan pasien bpjs`);
                                    await page.goto(url1, {waitUntill: "networkidle2"});
                                }
                        } else {
                                console.log("[INFO] Pasien dengan No ", entry.nik, "Pasien tidak aktif");
                                updateJsonStatusBPJS(entry.nik);
                                await page.goto(url1, {waitUntill: "networkidle2"});
                        }
                }else{
                    console.log("[INFO] Data dengan No Asuransi", entry.nik, "Tidak Ditemukan");
                        updateJsonStatusNotFound(entry.nik);
                        await page.evaluate(() => {
                                document.querySelector('#form_search > div:nth-child(2) > input').value = ''; // Mengganti dengan ID atau selector yang sesuai
                        });
                }
                            }//kondisi kosong
        }await browser.close();
})
rl.close();
            }else{
                const emailLogin = await askQuestion('Masukkan Email: ');
                const passwordLogin = await askQuestion('Masukkan Password: ');
                updateUserLogin(emailLogin, passwordLogin);
                rl.close();
            }
        })();
} catch (error){
        console.log('[ALERT] error bang')
}
