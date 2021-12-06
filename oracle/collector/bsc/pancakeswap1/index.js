const { pancakswap_busd_bnb_collector } = require('./busd_bnb');
const { pancakswap_cake_bnb_collector } = require('./cake_bnb');


async function collect_pancakeswap() {
    const busdBnb = await pancakswap_busd_bnb_collector();
    const cakeBnb = await pancakswap_cake_bnb_collector();

    return {
        busdBnb,
        cakeBnb,
    }
}

exports.collect_pancakeswap = collect_pancakeswap;
