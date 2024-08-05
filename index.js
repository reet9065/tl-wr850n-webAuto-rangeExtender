require('dotenv').config();
const readline = require('readline');
const {launchBrowser} = require('./controler/launch');
const {waitAndReturn} = require('./controler/waitFor');
const {intUserInput} = require('./controler/intInput');
const {LoadingLoger} = require("./controler/progressLoger");
const {logSSIDList} = require('./controler/wifiListLoger');
const command = process.argv[2];

//delay timer function
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

// opening the browser to a specific url
(async()=>{
    try {

        if(command == "makeEx"){
           const browser =  await launchBrowser(process.env.BROWER_PATH,true,process.env.ROUTER_IP_URL);
            await delay(2000);

            console.log(" ");
            console.log("Wait Login ho raha hai ⌛");
            console.log(" ");

            await browser.page.type('input[id = pc-setPwd-new]',process.env.INITIAL_PASSWORD);
            await browser.page.type('input[id = pc-setPwd-confirm]',process.env.INITIAL_PASSWORD);

            await delay(2000);

            await Promise.all([
                browser.page.waitForNavigation(),
                browser.page.click('button[id = pc-setPwd-btn]')
            ])

            const AdvanceSettingbtn = await waitAndReturn(browser.page,'#advanced > span.T_adv.text');
            await AdvanceSettingbtn.click();

            console.log("Login ho gaya 👍")
            console.log(" ");

            const OperationModebtn = await waitAndReturn(browser.page, '#menuTree > li:nth-child(2) > a');
            await OperationModebtn.click();

            const RangExtenderBtn = await waitAndReturn(browser.page,'#en_range_extender > label');
            await RangExtenderBtn.click();

            console.log("Operation mode Range Extender kar diye hai 🕸");
            console.log(" ");

            await browser.page.locator('button').click('#b_save');

            const RangeExtenderConformationPopup = await waitAndReturn(browser.page, '#alert-container > div > div.position-center-left > div > div.msg-btn-container > div > div:nth-child(2) > button');
            await RangeExtenderConformationPopup.click();

            var RangeExtenderProcesstime = await waitAndReturn(browser.page, '#gitem');



            var status = await LoadingLoger(browser.page,"#gitem","Operation mode range extender mode me ho raha hai : ");
            process.stdout.write(`Loading...`);
            readline.cursorTo(process.stdout, 0);
            readline.clearLine(process.stdout, 0);
            if(status){
                console.log("Range extender mode me ho gaya router 👍");
                console.log(" ");
                console.log("Ab Main wifi se connect hone ka try kar rahe hai  🌐");
                console.log(" ");
            }

            var ConectionLoginPageBtn = await waitAndReturn(browser.page, '#pc-login-btn');
            await browser.page.type('input[id = pc-login-password]',process.env.INITIAL_PASSWORD);
            await ConectionLoginPageBtn.click();

            const QuickSetupBtn = await waitAndReturn(browser.page, "#qs > span.T_qs.text.pl");
            await QuickSetupBtn.click();

            const connectionPage = await waitAndReturn(browser.page,"#tableWlSsidBody>tr.quicksetup-ssid-row:nth-child(2)");
            // await delay(3000);

            var SSIDlist;
            if(connectionPage){
                SSIDlist = await browser.page.$eval('#tableWlSsidBody', (el)=>{
                    var list = [];
                    el.querySelectorAll('tr.quicksetup-ssid-row').forEach((item,i)=>{
                        list.push({
                            SSID:item.querySelector('td:nth-child(2)').innerText,
                            Signel_straingth:item.querySelector('td:nth-child(3) > span').getAttribute("class").split('-')[2]
                        });
                    })
    
                    return list;
                })
            }



            logSSIDList(SSIDlist);
            console.log(' ');
            console.log("👆 upar wifi ka list dikh raha hoga, to jiska password .env file save hai wahi wifi no.")

            const conectWithSSIDNo = intUserInput("yaha pe type karo jaise (1 ya 2 ya 3... koe ek ) or phir Enter dabao: ",SSIDlist.length);

            if(SSIDlist.length > 0 && conectWithSSIDNo !== null){

                const selectWifi = await waitAndReturn(browser.page,`#tableWlSsidBody >tr.quicksetup-ssid-row:nth-child(${(conectWithSSIDNo+2)})`);
                await selectWifi.click();

                const nextBtn = await waitAndReturn(browser.page,"#t_next")
                const HostConectionPassword = process.env.HOST_PASSWORD;
                await browser.page.type('input[id = network_24g_pwd]',HostConectionPassword);
                await nextBtn.click();

                console.log(' ');
                console.log('wifi select ho gaya , password bhi bhara gaya 🤗');
                console.log(' ');

                const ssidNameNextBtn = await waitAndReturn(browser.page,"#next");
                const ExtenderSSIDname = process.env.EXTENDER_NAME;
                await browser.page.type('input[id = extend_ssid_24g]',ExtenderSSIDname);
                await ssidNameNextBtn.click();

                console.log(`tumara wifi ka name 👉 ${ExtenderSSIDname} 👈 hai file me jo save kiya tha`);
                console.log(' ');

                const ExSaveBtn = await waitAndReturn(browser.page, "#qs-end-save > div:nth-child(2) > div > form > button");
                await ExSaveBtn.click();

                const FinelLodingtext = await waitAndReturn(browser.page, "#quicksetup_wl_save_bar>.progressbar-wrap>.progressbar-text>span");
                const FinelLodingtextLoger = await LoadingLoger(browser.page,
                    "#quicksetup_wl_save_bar>.progressbar-wrap>.progressbar-text>span",
                    "Main wifi se connect hona chalu ho gaya :"
                )

                if(FinelLodingtextLoger){
                    await delay(2000);
                    await browser.browser.close();
                    console.log(`👏👏 Connect Ho gaya yehhh 🥳🥳🥳🥳 !! Thora der me 👉 ${ExtenderSSIDname} 👈 se router dikh jayega wifi list me
                                password hai 👉 ${HostConectionPassword} 👈`);

                }

            }else{
                console.log(`👎 wifi nahi dikha raha hai ek bhi light kat gaya ka? Nahi to 
                            Na hai to phir se router reset kar ke try karo`);
                await delay(500);
                await browser.browser.close();
            }

        }else if(command == "-ctn"){
            console.log("Conecting to the network...");
        }else{
            console.log(command, ": command not found");
        }

    } catch (error) {
        console.log(error);
        console.log(`
            Kuch to dikkat hua hai niche ka sara check karo 👇

            step 1 : router reset karo phir se
            step 2 : phir thora tora wait kar ke conect karo 
            step 3 : Check karo ki main wifi ka password sahi hai na jo file me hai 8 letter se kam nahi hona chahiye password
            step 4 : phir se script run karo (node makeEx)
            `)
    }
})();

