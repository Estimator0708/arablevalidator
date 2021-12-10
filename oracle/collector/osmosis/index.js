const axios = require('axios')
const CoinGecko = require('coingecko-api')
const coinGeckoApi = new CoinGecko();

async function collect_osmosis() {

    let priceData = (await coinGeckoApi.simple.price({
        ids: ['cosmos', 'osmosis'],
        vs_currencies: ['usd'],
    })).data;
    console.log('priceData: ' + JSON.stringify(priceData, null, 2))

    let poolData = await axios.get('https://lcd-osmosis.keplr.app/osmosis/gamm/v1beta1/pools/1').then(response => response.data)
    console.log('pool data: ' + JSON.stringify(poolData, null, 2))

    const atom = poolData.pool.poolAssets[0]
    const osmo = poolData.pool.poolAssets[1]

    if (atom.weight != osmo.weight) {
        throw `ATOM ${atom.weight} and OSMO ${osmo.weight} weight do not match!`
    }
    const totalSupply = atom.weight/10.0**6
    
    const totalAtom = atom.token.amount/10.0**6
    const atomPrice = priceData.cosmos.usd
    const totalOsmosis = osmo.token.amount/10.0**6
    const osmoPrice = priceData.osmosis.usd
    const totalLiquidity = totalAtom * atomPrice + totalOsmosis * osmoPrice

    const lpTokenPrice = totalLiquidity/totalSupply
    return {
        atomOsmoLpTokenPrice: lpTokenPrice
    }
}

exports.collect_osmosis = collect_osmosis