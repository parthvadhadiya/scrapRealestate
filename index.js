const puppeteer = require('puppeteer');
const ScrapBase = require('./ScrapURL');
const ScrappingBase = require('./ScrapURL');
const scrapBase = new ScrappingBase();
const storeDb = require('./helper/storeDB')
const TestBugger = require("test-bugger");
const testBugger = new TestBugger({'fileName': __filename}); 


function extractItems() {
    
    const extractedElements = document.querySelectorAll('.css-8jw9t9');
    const price = [];
    for (let element of extractedElements) {
        
       let tmp = element.querySelector('[data-q="title"]').href
          price.push(tmp);
    }
    return price;
}

async function scrapeInfiniteScrollItems(
    page,
    extractItems,
    itemTargetCount,
    scrollDelay = 1000,
  ) {
    let items = [];
    try {
      let previousHeight;
      while (items.length < itemTargetCount) {
        items = await page.evaluate(extractItems);
        // console.log(items)
        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
        await page.waitFor(scrollDelay);
      }
    } catch(e) {
        console.log(e)
     }
    return items;
  }

(async () => {
    const browser = await puppeteer.launch({ 
        headless: false,
        args : ['--start-maximized'],
        defaultViewport: null
    });
    const page = await browser.newPage();
    // await page.setViewport({ width: 1280, height: 800 });
    const navigationPromise = page.waitForNavigation();
    
    await page.goto('https://housing.com/rent/property-for-rent-in-ahmedabad',
        {waitUntil: 'networkidle0'});
    
    
    let list_length = await page.evaluate((sel) => {
        let elements = Array.from(document.querySelectorAll(sel));
        return elements.length;
    }, '.css-1tmrbla');
    let allLoc = []
    
    console.log(list_length)
    for(let i=0; i< list_length; i++){
        var href = await page.evaluate((l, sel) => {
            let elements= Array.from(document.querySelectorAll(sel));
            let anchor  = elements[l]
            if(anchor){
                return anchor.href
            }else{
                return '';
            }
        }, i, '.css-1tmrbla');
        allLoc.push(href)
    } 
    const page2 = await browser.newPage();
    for(const loc of allLoc){
        await page2.goto(loc,  {waitUntil: 'networkidle0'});
        // await page2.waitFor(1000)
        let totalProp = await page2.evaluate(`document.querySelector('[data-q="page-info-map"]').innerText`)
        totalProp = totalProp.split(" ")
        totalProp = totalProp[totalProp.length - 2]
        testBugger.informLog(`total number of pro ${totalProp}`)
        let urlOfallProp = await scrapeInfiniteScrollItems(page2, extractItems, totalProp - 1);
        let dataOBJ = {}
        for(let url of urlOfallProp){
            await storeDb("scrap", "data", {"url":url})
        }
                
        // await page2.close()
    }
    



     

    
    // await browser.close();
})()