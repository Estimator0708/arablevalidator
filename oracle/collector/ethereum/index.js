const { collect_uniSwap_aave_crv } = require('./uniSwap');

async function collect_eth() {
  const ethdata = await collect_uniSwap_aave_crv();
  return {
    ethdata,
  };
}

exports.collect_eth = collect_eth;
