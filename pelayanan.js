const puppeteer = require('puppeteer');
const fs = require('fs');
const url = "https://pasuruan.epuskesmas.id/login";
const url1 = "https://pasuruan.epuskesmas.id/pelayanan?broadcastNotif=1";
const pelayananRuang = 'https://pasuruan.epuskesmas.id/pelayanan?searchKey=&orderedParam=%7B%22key%22%3A%22%22%2C%22type%22%3A%22%22%7D&page=1&limit=10&ruangan_id=0349&tanggal=06-11-2024&status_periksa=0&status_kritis=&skrining_visual=&mapping_klaster=&siklus_hidup=';
const loginpustu = JSON.parse(fs.readFileSync('./lib/userlogin.json', 'utf-8'));
const {calculateAge} = require('./function/script');
const email = loginpustu[0].email;
const password = loginpustu[0].password;

try {
    (async () => {
            // Launch browser
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
        
            // Go to the desired URL
            await page.goto(url, {
                    waitUntill: "networkidle2"
            }).then(async () =>{
                console.log('[INFO] Sedang Melakukan Login Username & Password');
                await page.type("#email", email);
                await page.type("#password", password)
                await new Promise(resolve => setTimeout(resolve, 1000));
                await page.click("#login")
                //end fungsi login
                await new Promise(resolve => setTimeout(resolve, 5000));
                console.log('[INFO] Memilih Lokasi Puskes');
                await page.waitForSelector('#content > div:nth-child(2) > div.panel-body.row > form > div > button');
                await new Promise(resolve => setTimeout(resolve, 2000));
                await page.click("#content > div:nth-child(2) > div.panel-body.row > form > div > button")
                await new Promise(resolve => setTimeout(resolve, 3000));
                await page.click("#menu_pendaftaran")
                await new Promise(resolve => setTimeout(resolve, 3000));
                await page.click("#menu_pendaftaran_pasien")
                await new Promise(resolve => setTimeout(resolve, 2000));
                await page.click("#button_fitur_tunda")
                await new Promise(resolve => setTimeout(resolve, 2000));
                await page.click("#modal > div > div > div.modal-form > div:nth-child(1) > div > div > div > span")
                await new Promise(resolve => setTimeout(resolve, 5000));
                    await page.goto(url1, {
                        waitUntill: "networkidle2"
                    }).then(async () =>{
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        await page.waitForSelector('#optionRuanganMedis');
                        await page.select('#optionRuanganMedis', await page.$eval('#optionRuanganMedis > option:nth-child(26)', el => el.value));
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        let noDataFound = false;
                        console.log(noDataFound)
                        while(!noDataFound){
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
                                if(popupOke == 'Ok'){
                                    await page.click('#box-KlasterSiklusHidup > div.badge-pemberitahuan > div:nth-child(2) > button')
                                }
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                await page.click('#button_anamnesa'); 
                                await new Promise(resolve => setTimeout(resolve, 5000));
                                const currentPageUrl = await page.url();
                                console.log(currentPageUrl);
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
                                console.log(tableData);
                                const hasilumur = calculateAge(tableData["Tempat & Tgl Lahir"]);
                                console.log(`Jenis kelamin pasien: ${tableData['Jenis Kelamin']} umur pasien: ${hasilumur.toString()} dengan NIK: ${tableData['NIK']}`)
                                // Select Status Berobat
                                await page.waitForSelector('select[name="Pelayanan[statuspulang_id]"]');
                                await page.select('select[name="Pelayanan[statuspulang_id]"]', '01');
                                // Uncheck
                                await page.click("#check-kontrol");
                                //input nadi
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
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                await page.goto(currentPageUrl, {waitUntill: "networkidle2"});
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                await page.click('#button_diagnosa')
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                await page.click('#check-kontrol');
                                await page.type('input[name="diagnosa_id"]', 'z71.8');
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                await page.click('.ui-menu-item:first-child');
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                await page.select('select[name="prognosa"]', '02');
                                await page.click('#button_save')
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                await page.click('#button_selesai');
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                await page.goto(url1, {waitUntill: "networkidle2"});
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }else{
                                console.log('tidak ada data disini');
                                console.log(noDataFound)
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                await page.goto(url1, {waitUntill: "networkidle2"});
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }
                    })
            })
            
    })();
} catch (error){
console.log('error bang')
}