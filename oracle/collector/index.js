const { collect_bsc } = require('./bsc');
const { collect_osmosis } = require('./osmosis');
const { collect_solana } = require('./solana');
const { collect_eth } = require('./ethereum');
const { collect_polygon } = require('./polygon');
const { coingecko_prices } = require('./coingecko');
const { collect_terra } = require('./terra');

async function collect() {
  console.log('collecting coingecko prices');
  const coingecko = await coingecko_prices();

  console.log('collecting bsc information');
  const bsc = await collect_bsc();

  console.log('collecting solana information');
  const solana = await collect_solana();

  console.log('collecting osmosis information');
  const osmosis = await collect_osmosis();

  console.log('collecting ethereum information');
  const eth = await collect_eth();

  console.log('collecting polygon information');
  const poly = await collect_polygon();

  console.log('collecting terra information');
  const terra = await collect_terra();

  return {
    coingecko,
    bsc,
    solana,
    osmosis,
    eth,
    poly,
    terra,
  };
}
exports.collect = collect;
