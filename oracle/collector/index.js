const { collect_bsc } = require('./bsc');
const { collect_osmosis } = require('./osmosis');
const { collect_solana } = require('./solana');

async function collect() {
    const bsc = await collect_bsc();
    const solana = await collect_solana();
    const osmosis = await collect_osmosis();
    
    return {
        bsc,
        solana,
        osmosis,
    }
}

exports.collect = collect;