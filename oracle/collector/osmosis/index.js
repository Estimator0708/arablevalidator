const axios = require('axios')
const dayjs = require('dayjs')
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration)
const CoinGecko = require('coingecko-api')
const coinGeckoApi = new CoinGecko();

async function collect_osmosis() {

    let priceData = (await coinGeckoApi.simple.price({
        ids: ['cosmos', 'osmosis'],
        vs_currencies: ['usd'],
    })).data;
    //console.log('priceData: ' + JSON.stringify(priceData, null, 2))

    // compute ATOM-OSMO LP token price
    const poolId = 1 //ATOM-OSMO
    const poolData = await axios.get('https://lcd-osmosis.keplr.app/osmosis/gamm/v1beta1/pools/' + poolId).then(res => res.data.pool)
    //console.log('pool data: ' + JSON.stringify(poolData, null, 2))

    const atom = poolData.poolAssets[0]
    const osmo = poolData.poolAssets[1]

    if (atom.weight != osmo.weight) {
        throw `ATOM ${atom.weight} and OSMO ${osmo.weight} weight do not match!`
    }
    const totalSupply = atom.weight/10.0**6
    
    const totalAtom = atom.token.amount/10.0**6
    const atomPrice = priceData.cosmos.usd
    const totalOsmo = osmo.token.amount/10.0**6
    const osmoPrice = priceData.osmosis.usd
    const totalLiquidity = totalAtom * atomPrice + totalOsmo * osmoPrice

    const lpTokenPrice = totalLiquidity/totalSupply

    // compute LP token reward APY for 14 day bondage
    const distrInfo = await axios.get('https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/distr_info').then(res => res.data.distr_info)
    //console.log('distroInfo: ' + JSON.stringify(distrInfo, null, 2))
    const totalWeight = distrInfo.total_weight
    
    const incentivizedPools = await axios.get('https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/incentivized_pools').then(res =>
        res.data.incentivized_pools.filter(ip => ip.pool_id == poolId)
    )
    //console.log('incentiziedPools: ' + JSON.stringify(incentivizedPools, null, 2))
    const gaugeId14Days = incentivizedPools.filter(ip => ip.lockable_duration == '1209600s')[0].gauge_id
    const potWeight = distrInfo.records.filter(r => r.gauge_id == gaugeId14Days)[0].weight

    const mintParams = await axios.get('https://lcd-osmosis.keplr.app/osmosis/mint/v1beta1/params').then(res => res.data.params)
    //console.log('mintParams: ' + JSON.stringify(mintParams, null, 2))
    const mintPrice = osmoPrice
    const epochIdentifier = mintParams.epoch_identifier

    const epochs = await axios.get('https://lcd-osmosis.keplr.app/osmosis/epochs/v1beta1/epochs').then(res => res.data.epochs)
    //console.log('epochs: ' + JSON.stringify(epochs, null, 2))
    const epoch = epochs.filter(e => e.identifier == epochIdentifier)[0]
    const epochDuration = dayjs.duration(parseInt(epoch.duration.replace('s', '')) * 1000);

    const epochProvision = await axios.get('https://lcd-osmosis.keplr.app/osmosis/mint/v1beta1/epoch_provisions').then(res => res.data.epoch_provisions)
    const numEpochPerYear = dayjs.duration({years: 1,}).asMilliseconds() / epochDuration.asMilliseconds();
    const yearProvision = epochProvision * numEpochPerYear
    const yearProvisionToPots = yearProvision * mintParams.distribution_proportions.pool_incentives
    const yearProvisionToPot = yearProvisionToPots * (potWeight / totalWeight)
    const yearProvisionToPotPrice = mintPrice * yearProvisionToPot

    const poolTotalValueLocked = totalAtom * atomPrice + totalOsmo + osmoPrice

    const rewardApy = yearProvisionToPotPrice / poolTotalValueLocked
    return {
        atomOsmoLpTokenPrice: lpTokenPrice,
        atomOsmoLpTokenRewardApy: rewardApy // expect ~APR 117.86%
    }
}

exports.collect_osmosis = collect_osmosis