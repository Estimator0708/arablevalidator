const { collect } = require('./collector');

async function main() {
    const data = await collect();
    console.log('collection', JSON.stringify(data, null, '\t'));

    // TODO: submit data onchain - call submitter
}

main();