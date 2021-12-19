const { collect_raydium } = require('./raydium');

async function collect_solana() {
  const raydium = await collect_raydium();
  return {
    raydium,
  };
}

exports.collect_solana = collect_solana;
