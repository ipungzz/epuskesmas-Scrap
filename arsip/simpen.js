const { exec } = require("child_process");
const puppeteer = require('puppeteer');
const fs = require('fs');
const url = "https://pasuruan.epuskesmas.id/login";
const url1 = "https://pasuruan.epuskesmas.id/pelayanan?broadcastNotif=1";
const url2 = "https://pasuruan.epuskesmas.id/pasien?broadcastNotif=1";
const pelayananRuang = 'https://pasuruan.epuskesmas.id/pelayanan?searchKey=&orderedParam=%7B%22key%22%3A%22%22%2C%22type%22%3A%22%22%7D&page=1&limit=10&ruangan_id=0349&tanggal=06-11-2024&status_periksa=0&status_kritis=&skrining_visual=&mapping_klaster=&siklus_hidup=';
const loginpustu = JSON.parse(fs.readFileSync('./lib/userlogin.json', 'utf-8'));
const {calculateAge, askQuestion, tinggi, beratIdeal} = require('./function/script');
const { table } = require('console');
const email = loginpustu[0].email;
const password = loginpustu[0].password;

async function sendWa(nosend, pesand) {
  const url = "http://localhost:8080/postapi";
  const key = "SIPALINGNT";

  try {
      const response = await axios.post(url, null, {
          params: {
              nomer: nosend,
              pesan: pesand,
              key: key
          }
      });
      
      console.log("Response:", response.data);
      return response.data;
  } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
  }
}

try {
    (async () => {
            // Launch browser
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
        
            // Go to the desired URL
            await page.goto(url, {
                    waitUntill: "networkidle2"
            }).then(async () =>{
                const tanggalProses1 = await askQuestion('Masukkan Tanggal yang akan di Proses: ');
                let tanggalProses = tanggalProses1;
                await new Promise(resolve => setTimeout(resolve, 5000));
                        console.log('[INFO] Sedang Melakukan Login Username & Password');
                        await page.type("#email", email);
                        await page.type("#password", password)
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        await page.click("#login")
                        //end fungsi login
                        sendWa("081359536415", "Berhasil Login");
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        console.log('[INFO] Memilih Lokasi Puskes');
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        await page.waitForSelector('#content > div:nth-child(2) > div.panel-body.row > form > div > button', { timeout: 5000 });
                        await page.click("#content > div:nth-child(2) > div.panel-body.row > form > div > button")
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        await page.click("#menu_pendaftaran")
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        await page.click("#menu_pendaftaran_pasien")
                        console.log('[INFO] Memilih Fitur Tunda');
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        await page.click("#button_fitur_tunda")
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        await page.click("#modal > div > div > div.modal-form > div:nth-child(1) > div > div > div > span")
                        if(tanggalProses == ""){
                                console.log('[Action] Pilih Tanggal Waktu Tunda, 5 detik berjalan');
                                await new Promise(resolve => setTimeout(resolve, 5000));
                        }else{
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                console.log(tanggalProses);
                                await page.evaluate((tanggalProses) => {
                                        const dateElements = document.querySelectorAll('.datepicker-days td.day'); // Selector tanggal di date picker
                                        for (const dateElement of dateElements) {
                                          if (dateElement.textContent.trim() === tanggalProses) {
                                            dateElement.click(); // Klik tanggal
                                            break;
                                          }
                                        }
                                      }, tanggalProses);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        page.click("#button_aktifkan")
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        }
                        await page.goto(url1, {waitUntill: "networkidle2"}).then(async () =>{
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        await page.waitForSelector('#optionRuanganMedis');
                        await page.select('#optionRuanganMedis', await page.$eval('#optionRuanganMedis > option:nth-child(26)', el => el.value));
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        let noDataFound = true;
                        while(noDataFound){
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                noDataFound = await page.evaluate(() => {
                          const tableCell = document.querySelector('#datatableMedisWrapper > div.table-responsive > table > tbody > tr > td');
                        return tableCell && tableCell.innerText.includes('Data tidak ditemukan');
                        });
                            if(noDataFound.toString() == 'false'){
                                await new Promise(resolve => setTimeout(resolve, 3000));
                                await page.click('#datatableMedisWrapper > div.table-responsive > table > tbody > tr:nth-child(1) > td:nth-child(1)', { clickCount: 2 }); 
                                const popupOke = await page.evaluate(() => {
                                    const element = document.querySelector('#box-KlasterSiklusHidup > div.badge-pemberitahuan > div:nth-child(2) > button > b');
                                    return element ? element.innerText : null;
                                  });
                                  console.log(popupOke);
                                if(popupOke == 'Ok'){
                                  await new Promise(resolve => setTimeout(resolve, 3000));
                                  await page.waitForSelector('#box-KlasterSiklusHidup > div.badge-pemberitahuan > div:nth-child(2) > button')
                                    await page.click('#box-KlasterSiklusHidup > div.badge-pemberitahuan > div:nth-child(2) > button')
                                }
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                await page.click('#button_anamnesa'); 
                                await new Promise(resolve => setTimeout(resolve, 5000));
                                const currentPageUrl = await page.url();
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                const tableData = await page.evaluate(() => {
                                    const tables = document.querySelectorAll('.panel-body.box-bordered table');
                                    const data = {};
                                
                                    tables.forEach(table => {
                                      const rows = table.querySelectorAll('tbody tr');
                                      rows.forEach(row => {
                                        const cells = row.querySelectorAll('td');
                                        if (cells.length === 3) {  // Hanya ambil baris dengan format 3 kolom (label, :, data)
                                          const key = cells[0].innerText.trim();
                                          let value = cells[2].innerText.trim();
                                          
                                          // Jika baris adalah "Tempat & Tgl Lahir", ambil hanya tanggal lahir
                                          if (key === 'Tempat & Tgl Lahir') {
                                            const tanggalLahirOnly = value.split(',')[1]?.trim();  // Ambil teks setelah koma
                                            value = tanggalLahirOnly || value;  // Jika tanggal ditemukan, gunakan tanggal saja
                                          }

                                          if (key === 'Asuransi') {
                                            const bpjsText = value.split('BPJS Kesehatan /')[1]?.trim();
                                            if (bpjsText) {
                                              // Ambil angka yang mengikuti "BPJS Kesehatan /"
                                              const bpjsNumber = bpjsText.split(' ')[0];  // Ambil hanya angka sebelum spasi
                                              value = bpjsNumber;  // Ganti value dengan angka BPJS
                                            }
                                          }


                                          
                                          data[key] = value;
                                        }
                                      });
                                    });
                                
                                    return data;
                                  });
                                const hasilumur = calculateAge(tableData["Tempat & Tgl Lahir"]);
                                const resulttinggi = tinggi(hasilumur.toString(), tableData['Jenis Kelamin']);
                                const resultbadan = beratIdeal(resulttinggi.toString(), hasilumur.toString(), tableData['Jenis Kelamin'])
                                console.log(`[INFO] Nama: ${tableData['Nama']} Jenis kelamin pasien: ${tableData['Jenis Kelamin']} umur pasien: ${hasilumur.toString()} dengan NIK: ${tableData['NIK']} No.Asuransi: ${tableData['Asuransi']}`)
                                // Select Status Berobat
                                await new Promise(resolve => setTimeout(resolve, 3000));
                                  const namaDokter = await page.evaluate(() => {
                                    const inputElement = document.querySelector('#form_create > div:nth-child(2) > div > div.panel-body.box-bordered > div:nth-child(1) > div > input.form-control.input-sm.ui-autocomplete-input');
                                    return inputElement && inputElement.value === '';
                                  });
                                  const tinggiBadanKosong = await page.evaluate(() => {
                                    const inputElement = document.querySelector('#tinggi_badan');
                                    return inputElement && inputElement.value === '0';
                                  });
                                  const beratBadanKosong = await page.evaluate(() => {
                                    const inputElement = document.querySelector('#berat_badan');
                                    return inputElement && inputElement.value === '0';
                                  });
                                  if(namaDokter == true){
                                    console.log("mengisi nama dokter");
                                    await new Promise(resolve => setTimeout(resolve, 3000));
                                    if(tableData['Jenis Kelamin'] == 'Perempuan'){
                                      await page.type('#form_create > div:nth-child(2) > div > div.panel-body.box-bordered > div:nth-child(1) > div > input.form-control.input-sm.ui-autocomplete-input', 'siti mariana');
                                      await new Promise(resolve => setTimeout(resolve, 2000));
                                      await page.click('.ui-menu-item:first-child');
                                      await new Promise(resolve => setTimeout(resolve, 1000));
                                    }else{
                                      await page.type('#form_create > div:nth-child(2) > div > div.panel-body.box-bordered > div:nth-child(1) > div > input.form-control.input-sm.ui-autocomplete-input', 'lilik');
                                        await new Promise(resolve => setTimeout(resolve, 3000));
                                        await page.click('.ui-menu-item:first-child');
                                        await new Promise(resolve => setTimeout(resolve, 1000));
                                    }
                                  }
                                await page.waitForSelector('select[name="Pelayanan[statuspulang_id]"]');
                                await page.select('select[name="Pelayanan[statuspulang_id]"]', '01');
                                // Uncheck
                                if (tinggiBadanKosong == true){
                                  console.log("tinggi badan di isi 0");
                                }
                                await page.click("#check-kontrol");
                                //input nadi
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                await page.type('#detak-nadi', '80');
                                //input nafas
                                await page.type('#nafas', '20');
                                await page.type('#text_edukasi', 'kontrol')
                                if(hasilumur.toString() >=15){
                                    console.log('dewasa')
                                    await page.type('#sistole', '12');
                                    await page.type('#diastole', '8');
                                    if(tableData['Jenis Kelamin'] == 'Perempuan'){
                                        console.log('Perempuan')
                                        await page.type('#collapsePeriksaFisik > div:nth-child(1) > div:nth-child(9) > div > div > input','80')
                                        await page.click('#button_save')
                                    }else{
                                        console.log('Laki-laki')
                                        await page.type('#collapsePeriksaFisik > div:nth-child(1) > div:nth-child(9) > div > div > input','90')
                                        await page.click('#button_save')
                                    }
                                }else{
                                    console.log('balita')
                                    await page.type('#sistole', '9');
                                    await page.type('#diastole', '6');
                                    await page.type('#collapsePeriksaFisik > div:nth-child(1) > div:nth-child(9) > div > div > input', '60');
                                    await page.click('#button_save')
                                }
                                await new Promise(resolve => setTimeout(resolve, 3000));
                                await page.goto(currentPageUrl, {waitUntill: "networkidle2"});
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                await page.click('#button_diagnosa')
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                await page.click('#check-kontrol');
                                await page.type('input[name="diagnosa_id"]', 'z71.8');
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                await page.click('.ui-menu-item:first-child');
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                await page.select('select[name="prognosa"]', '02');
                                await new Promise(resolve => setTimeout(resolve, 2100));
                                await page.click('#button_save')
                                await new Promise(resolve => setTimeout(resolve, 3000));
                                await page.click('#button_selesai');
                                await new Promise(resolve => setTimeout(resolve, 3000));
                                await page.goto(url1, {waitUntill: "networkidle2"});
                                await new Promise(resolve => setTimeout(resolve, 2000));
                            }else{
                              console.log('tidak ada data disini');
                            tanggalProses++;
                            console.log(tanggalProses);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            await page.goto(url2, {waitUntill: "networkidle2"}).then(async () =>{
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            console.log('[INFO] Memilih Fitur Tunda');
                            await new Promise(resolve => setTimeout(resolve, 3000));w
                            await page.click("#button_fitur_tunda")
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            await page.click("#modal > div > div > div.modal-form > div:nth-child(1) > div > div > div > span")
                                    await new Promise(resolve => setTimeout(resolve, 2000));
                                    await page.evaluate((tanggalProses) => {
                                            const dateElements = document.querySelectorAll('.datepicker-days td.day'); // Selector tanggal di date picker
                                            for (const dateElement of dateElements) {
                                              if (dateElement.textContent.trim() === tanggalProses.toString()) {
                                                dateElement.click(); // Klik tanggal
                                                break;
                                              }
                                            }
                                          }, tanggalProses.toString());
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            page.click("#button_aktifkan")
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            await page.goto(url1, {waitUntill: "networkidle2"});
                            await page.waitForSelector('#optionRuanganMedis');
                            await page.select('#optionRuanganMedis', await page.$eval('#optionRuanganMedis > option:nth-child(26)', el => el.value));
                            await new Promise(resolve => setTimeout(resolve, 3000));
                             return;
                          })   
                            }
                        }
                    })
            })
            
    })();
} catch (error){
console.log('error bang')
}