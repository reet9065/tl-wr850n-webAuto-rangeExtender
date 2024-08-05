const puppeteer = require('puppeteer-core');


exports.launchBrowser = async(chromePath,display,url)=>{
    try {
        const browser = await puppeteer.launch({
            "headless": display,
            defaultViewport: false,
            executablePath: chromePath
            
        });
        const page = await browser.newPage();
        await page.goto(url,{
            waitUntil: 'domcontentloaded'
        });

        return {page,browser};
        
    } catch (error) {
        return {Error:{message:error}};
    }
}