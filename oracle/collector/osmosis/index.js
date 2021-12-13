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
    const poolTotalValueLocked = totalAtom * atomPrice + totalOsmo * osmoPrice

    const lpTokenPrice = poolTotalValueLocked/totalSupply

    // compute LP token reward APY for 14 day bondage
    const distrInfo = await axios.get('https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/distr_info').then(res => res.data.distr_info)
    const totalWeight = distrInfo.total_weight
    
    const incentivizedPools = await axios.get('https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/incentivized_pools').then(res =>
        res.data.incentivized_pools.filter(ip => ip.pool_id == poolId)
    )
    const mintParams = await axios.get('https://lcd-osmosis.keplr.app/osmosis/mint/v1beta1/params').then(res => res.data.params)
    const epochs = await axios.get('https://lcd-osmosis.keplr.app/osmosis/epochs/v1beta1/epochs').then(res => res.data.epochs)
    const epochProvision = await axios.get('https://lcd-osmosis.keplr.app/osmosis/mint/v1beta1/epoch_provisions').then(res => res.data.epoch_provisions)
    
    // lockable durations: https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/lockable_durations
    const rewardApr1day = computeApr('86400s')
    const rewardApr7days = computeApr('604800s') + rewardApr1day
    const rewardApr14days = computeApr('1209600s') + rewardApr7days

    return {
        atomOsmoLpTokenTotalValueLockedUsd: poolTotalValueLocked,
        atomOsmoLpTokenPrice: lpTokenPrice,
        atomOsmoLpTokenReward14DaysBondedApr: rewardApr14days,
        atomOsmoLpTokenReward14DaysBondedAprPct: (100.0*rewardApr14days).toFixed(2) + '%'
    }

    function computeApr(duration) {
        const gaugeId = incentivizedPools.filter(ip => ip.lockable_duration == duration)[0].gauge_id
        const potWeight = distrInfo.records.filter(r => r.gauge_id == gaugeId)[0].weight

        const mintPrice = osmoPrice
        const epochIdentifier = mintParams.epoch_identifier

        const epoch = epochs.filter(e => e.identifier == epochIdentifier)[0]
        const epochDuration = dayjs.duration(parseInt(epoch.duration.replace('s', '')) * 1000)

        const numEpochPerYear = dayjs.duration({ years: 1, }).asMilliseconds() / epochDuration.asMilliseconds()

        const yearProvision = epochProvision * numEpochPerYear
        const yearProvisionToPots = yearProvision * mintParams.distribution_proportions.pool_incentives
        const yearProvisionToPot = yearProvisionToPots * (potWeight / totalWeight)
        const yearProvisionToPotPrice = mintPrice * yearProvisionToPot / 10 ** 6

        const rewardApr = yearProvisionToPotPrice / poolTotalValueLocked
        return rewardApr
    }
}

exports.collect_osmosis = collect_osmosis