const createDynamicModel = require('./dbConnection');
const TestBugger = require('test-bugger');
const testBugger = new TestBugger({"filename": __filename});


let url = "mongodb://127.0.0.1:27017";
// let MONGO_DB_NAME = "scrapingData";


async function fetchDB(MONGO_DB_NAME, COLLNAME) {
    let collections;
    try {
        collections = await createDynamicModel(url, MONGO_DB_NAME, COLLNAME)
    } catch (e) {
        testBugger.errorLog(e);
        testBugger.errorLog("Error in getting Collection OBJ")
    }
    let output;
    try {
        output = collections.find({});
    } catch (e) {
        testBugger.errorLog(e);
        testBugger.errorLog("Error in data fetching from " + COLLNAME)
    }

    if (output == undefined) {
        console.log("Data fatched from" + COLLNAME)
        return true
    }
    return output
}

module.exports = fetchDB