const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const fileinput = './lib/data.json';
const {tinggi, calculateAge, updateJsonStatusSucces, updateJsonStatusNotFound, updateJsonStatusRegion, updateJsonStatusBPJS, beratIdeal, askQuestion, updateUserLogin,rl} = require('./function/script');
const loginpustu = JSON.parse(fs.readFileSync('./lib/userlogin.json', 'utf-8'));
const email = loginpustu[0].email;
const password = loginpustu[0].password;
const url = "http://e.mankopas.com/jibas/infoguru/";
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
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto(url, {
                waitUntill: "networkidle2"
            }).then(async () =>{
                await page.waitForSelector('#username');
                await page.type('#username', '19821008')
                await new Promise(resolve => setTimeout(resolve, 1000));
                await page.type('#passwordsfake', '123456')
                await new Promise(resolve => setTimeout(resolve, 1000));
                await page.click('input[type=submit]')
                //wait new Promise(resolve => setTimeout(resolve, 3000));
                await page.waitForSelector('a[href="javascript:akademik();"]');
                await page.click('a[href="javascript:akademik();"]');
                await new Promise(resolve => setTimeout(resolve, 1000));
                await page.click('#infosiswa')
            })
        })();
} catch (error){
        console.log('[ALERT] error bang')
}
