const { spookySwap_ftm_usdc_collector } = require("./ftmUsdc");

async function collect_SpookySwap() {
  const usdcFtm = await spookySwap_ftm_usdc_collector();

  return {
    usdcFtm,
  };
}

exports.collect_SpookySwap = collect_SpookySwap;
