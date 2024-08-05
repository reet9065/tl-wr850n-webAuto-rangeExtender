const { timeout } = require("puppeteer-core")

exports.waitAndReturn = async(page,selector)=>{
    try {
        const Element = await page.waitForSelector(selector,{timeout:20000})
        return Element;
    } catch (error) {
        return {Error:{message:error}};
    }

}