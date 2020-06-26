const createDynamicModel = require('./dbConnection');
const TestBugger = require('test-bugger');
const testBugger = new TestBugger({"filename": __filename});


let url = "mongodb://127.0.0.1:27017";
// let MONGO_DB_NAME = "scrapingData";


async function getCollection(MONGO_DB_NAME, COLLNAME) {
    let collections;
    try {
        collections = await createDynamicModel(url, MONGO_DB_NAME, COLLNAME)
    } catch (e) {
        testBugger.errorLog(e);
        testBugger.errorLog("Error in getting Collection OBJ")
    }
    
    return collections
}

module.exports = getCollection