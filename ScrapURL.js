const fetchDB = require('./helper/fetchDB');
const puppeteer = require('puppeteer');
// const getcoll = require('./helper/getCollection')
const storeDb = require('./helper/storeDB');

const nameSelector = '.css-10rvbm3'
const priceSelector = '.css-4as5pv'
const addressSelector = '.css-1ru8tnn'
const projectNameSelector = '.css-1a0ylq3'
const securitySelector = '.css-19ug521'
const areaSelector = '#overviewPoints > div > table > tbody > tr:nth-child(4) > td > div'
const furnishingSelector = '#overviewPoints > div > table > tbody > tr:nth-child(5) > td > div'
const bathroomSelector = '#overviewPoints > div > table > tbody > tr:nth-child(6) > td > div'

async function scrapPage(url, page){
    await page.goto(url,
        {waitUntil: 'networkidle0'});
    let result = {}
    let name = await page.evaluate(`document.querySelector('${nameSelector}').innerText`)
    let price = await page.evaluate(`document.querySelector('${priceSelector}').innerText`)
    let address = await page.evaluate(`document.querySelector('${addressSelector}').innerText`)
    let projectName = await page.evaluate(`document.querySelector('${projectNameSelector}').innerText`)
    let security = await page.evaluate(`document.querySelector('${securitySelector}').innerText`)
    let area = await page.evaluate(`document.querySelector('${areaSelector}').innerText`)
    let furnishing = await page.evaluate(`document.querySelector('${furnishingSelector}').innerText`)
    let bathroom = await page.evaluate(`document.querySelector('${bathroomSelector}').innerText`)
    result.name = name
    result.price = price
    result.address = address
    result.projectName = projectName
    result.security = security
    result.area = area
    result.furnishing = furnishing
    result.bathroom = bathroom
    return result
}

(async()=>{

    const browser = await puppeteer.launch({ 
        headless: false,
        args : ['--start-maximized'],
        defaultViewport: null
    });
    const page = await browser.newPage();
    // await page.setViewport({ width: 1280, height: 800 });
    const navigationPromise = page.waitForNavigation();
    
    let cursor = await fetchDB("scrap", "data")
    // let collection = await getcoll("scrap", "data")
    let document;
    while ((document = await cursor.next())) {
        let result  = await scrapPage(document.url, page)  
        Object.assign(document, result)
        await storeDb("scrap", "finalData", document)
        console.log(document)
    }    
})()