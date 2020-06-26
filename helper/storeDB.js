const createDynamicModel = require('./dbConnection');
const TestBugger = require('test-bugger');
const testBugger = new TestBugger({"filename": __filename});


let url = "mongodb://127.0.0.1:27017";
// let MONGO_DB_NAME = "scrapingData";


async function storeDB(MONGO_DB_NAME, COLLNAME, dataObj) {
    let collections;
    try {
        collections = await createDynamicModel(url, MONGO_DB_NAME, COLLNAME)
    } catch (e) {
        testBugger.errorLog(e);
        testBugger.errorLog("Error in getting Collection OBJ")
    }
    let output;
    try {
        output = await collections.insertOne(dataObj)
    } catch (e) {
        testBugger.errorLog(e);
        testBugger.errorLog("error in data saving on " + COLLNAME)
    }
    if (output) {
        console.log("Data Stored on " + COLLNAME)
        return true
    }
    return false
}

module.exports = storeDB