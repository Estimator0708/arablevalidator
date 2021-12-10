const { collect_bsc } = require('./bsc');
const { collect_solana } = require('./solana');
const { collect_eth } = require('./ethereum');
const { collect_polygon } = require('./polygon')

async function collect() {
    const bsc = await collect_bsc();
    const solana = await collect_solana();
    const eth = await collect_eth();
    const poly = await collect_polygon();
    
    return {
        bsc,
        solana,
        eth,
        poly,
    }
}
exports.collect = collect;
