const {priceFeed} = require('./priceScript');

async function cronPriceJob(){
    const priceJob = await priceFeed();
    return{
        priceJob,
    }
}
exports.cronPriceJob = cronPriceJob;