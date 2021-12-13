const {feedingPrice} = require('./tokenData')
//require('dotenv').config()

async function onChainPriceFeed() {
    const onChainPrice = await feedingPrice()

    return{
        onChainPrice,
    }
}

exports.onChainPriceFeed = onChainPriceFeed