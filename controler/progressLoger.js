const readline = require('readline');

exports.LoadingLoger = async (page, selector, LodingMessage) => {
    return new Promise(async (resolve, reject) => {
        try {
            var loaderText = await page.$eval(selector, el => el.innerText.split('%')[0]);

            while(loaderText !== '100'){
                loaderText = await page.$eval(selector, el => el.innerText.split('%')[0]);
                readline.cursorTo(process.stdout, 0);
                readline.clearLine(process.stdout, 0);
                process.stdout.write(`${LodingMessage}: ${loaderText}%`);
            }
        
            readline.cursorTo(process.stdout, 0);
            readline.clearLine(process.stdout, 0);

            resolve(true); // Resolve the promise when loading is complete
            

        } catch (error) {
            console.log(error);
            reject(false); // Reject the promise in case of an error
        }
    });
};