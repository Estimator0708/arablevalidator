const { collect_bsc } = require('./bsc');
const { collect_solana } = require('./solana');

async function collect() {
    const bsc = await collect_bsc();
    const solana = await collect_solana();
    
    return {
        bsc,
        solana,
    }
}

exports.collect = collect;