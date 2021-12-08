const { collect_bsc } = require('./bsc');
const { collect_solana } = require('./solana');
const { collect_eth } = require('./ethereum');

async function collect() {
    const bsc = await collect_bsc();
    const solana = await collect_solana();
    const eth = await collect_eth();
    
    return {
        bsc,
        solana,
        eth,
    }
}

exports.collect = collect;
