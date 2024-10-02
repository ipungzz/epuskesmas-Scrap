const puppeteer = require('puppeteer');
const url = "https://pasuruan.epuskesmas.id/login";
const url1 = "https://pasuruan.epuskesmas.id/pelayanan?broadcastNotif=1";
const email = "ivaindrayani";
const password = "Pohjentrek@35";

try {
    (async () => {
            // Launch browser
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
        
            // Go to the desired URL
            await page.goto(url, {
                    waitUntill: "networkidle2"
            }).then(async () =>{
                await page.type("#email", email)
                await new Promise(resolve => setTimeout(resolve, 2000));
                await page.type("#password", password)
                await page.click("#login")
                await new Promise(resolve => setTimeout(resolve, 3000));
                await page.click("#content > div:nth-child(2) > div.panel-body.row > form > div > button")
                await new Promise(resolve => setTimeout(resolve, 3000));
                await page.click("#menu_pendaftaran")
                await new Promise(resolve => setTimeout(resolve, 2000));
                await page.click("#menu_pendaftaran_pasien")
                await new Promise(resolve => setTimeout(resolve, 3000));
                await page.click("#button_fitur_tunda")
                await new Promise(resolve => setTimeout(resolve, 2000));
                await page.click("#modal > div > div > div.modal-form > div:nth-child(1) > div > div > div > span")
                await new Promise(resolve => setTimeout(resolve, 5000));
                await page.goto(url1, {waitUntill: "networkidle2"});
                
            })
    })();
} catch (error){
console.log('error bang')
}