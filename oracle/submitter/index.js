const {feedingPrice} = require('./collectingPrice/tokenData')
//require('dotenv').config()
//priceFeed is an array
async function onChainPriceFeed(priceFeed) {
    const onChainPrice = await feedingPrice(priceFeed)

    return{
        onChainPrice,
    }
}

exports.onChainPriceFeed = onChainPriceFeed