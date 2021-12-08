const {crv_three_pool}  = require('./crvThreePool')
const {aaveLending_usdt}  = require('./aaveUsdtLending')
const {uniSwap_eth_tru_collector}  = require('./truEth')
const {uniSwap_weth_usdt_collector}  = require('./ethUsdt');

async function collect_uniSwap_aave_crv(){
    const threePool = await crv_three_pool();
    const usdtAave = await aaveLending_usdt();
    const ethTru = await uniSwap_eth_tru_collector();
    const ethUsdt = await uniSwap_weth_usdt_collector();

    return{
        threePool,
        usdtAave,
        ethTru,
        ethUsdt,
    }
}

exports.collect_uniSwap_aave_crv = collect_uniSwap_aave_crv;