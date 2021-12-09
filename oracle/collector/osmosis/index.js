const axios = require('axios')

async function collect_osmosis() {

    const poolData = await axios.get('https://api-osmosis.imperator.co/pools/v1/1').then(response => response.data)
    console.log('ATOM-OSMO pool data: ' + JSON.stringify(poolData, null, 2))
    const atom = poolData[0]
    const osmo = poolData[1]

    if (atom.liquidity != osmo.liquidity) {
        throw `ATOM ${atom.liquidity} and OSMO ${osmo.liquidity} liquidity do not agree!`
    }
    const totalSupply = atom.liquidity
    
    const totalTokenOne = atom.amount
    const atomPrice = atom.price
    const totalTokenTwo = osmo.amount
    const osmoPrice = osmo.price
    const totalLiquidity = totalTokenOne * atomPrice + totalTokenTwo * osmoPrice

    const lpTokenPrice = totalLiquidity/totalSupply
    return {
        atomOsmoLpTokenPrice: lpTokenPrice
    }
}

exports.collect_osmosis = collect_osmosis