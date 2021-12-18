const { collect } = require('./collector');
const { feed } = require('./submitter');
const { setter } = require('./setter');
const nodeCron = require("node-cron");
require("dotenv").config();

async function main() {
    await feedState()
    await rewardSetter()
}

async function feedState(){
        //All scripts will run first second of first minute every hour
        await nodeCron.schedule(" * * * * *",async function() {
            const state = await collect();
            console.log('collection', JSON.stringify(state, null, '\t'));
            await feed(state)
            console.log('feed the oracle successfully!');
        })
}

async function rewardSetter(){
//this job will run at 1st min of 1am. you can't run this job than once in a day. Epock is hardcode to 1day.  
        await nodeCron.schedule(" 1 1 * * *", async function(){
            await setter();
        }) 
}

main();
