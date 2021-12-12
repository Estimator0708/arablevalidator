const {quickswap_quick_eth_collector} = require('./quickEth')
const {quickswap_eth_usdc_collector} = require('./ethUsdc')

async function collect_quickswap(){
    const quickEth = await quickswap_quick_eth_collector();
    const ethUsdc = await quickswap_eth_usdc_collector();

    return{
        quickEth,
        ethUsdc,
    }
} 

exports.collect_quickswap = collect_quickswap;