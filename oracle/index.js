const { collect } = require('./collector');
//const {coingeckoPrice} = require('./collector')
const nodeCron = require("node-cron");
require('dotenv').config()

async function main() {
    
    //All scripts will run first second of first minute every hour
    await nodeCron.schedule(" 1 * * * *",async function(){
        const data = await collect();
        console.log('collection', JSON.stringify(data, null, '\t'));
    })
    // TODO: submit data onchain - call submitter
}

main();
