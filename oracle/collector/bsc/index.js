const { collect_pancakeswap } = require('./pancakeswap');

async function collect_bsc() {
  const pancakeswap = await collect_pancakeswap();
  return {
    pancakeswap,
  };
}

exports.collect_bsc = collect_bsc;
