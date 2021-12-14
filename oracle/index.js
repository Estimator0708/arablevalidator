const { collect } = require('./collector');
const {onChainPriceFeed} = require('./submitter')
const nodeCron = require("node-cron");
require("dotenv").config();

async function main() {    
    //All scripts will run first second of first minute every hour
<<<<<<< HEAD
    await nodeCron.schedule("* * * * *",async function(){
=======
    await nodeCron.schedule(" 1 * * * *",async function(){
>>>>>>> a5ac0a2370e2e58d8646243f5f4c12b8e4e36d1c
        const data = await collect();
        const onChainPrice = await onChainPriceFeed(data)
        console.log('collection', JSON.stringify(data, null, '\t'));
        console.log('On Chain Price', JSON.stringify(onChainPrice, null, '\t'));
    })
    // TODO: submit data onchain - call submitter
}

main();
