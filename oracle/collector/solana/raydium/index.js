const raydium = require('./lib/raydium.js');
const axios = require('axios');

function get_pairs() {
    return axios.get('https://api.raydium.io/pairs').then(response => response.data);
}

async function collect_raydium() {
    // api version
    const pairs = ['RAY-SOL', 'RAY-USDT']
    const keyMapping = {
        'RAY-SOL': 'raySol',
        'RAY-USDT': 'rayUsdt',
    }
    const apiPairs = (await get_pairs()).filter(pair => pairs.indexOf(pair.name.toUpperCase()) > -1);

    const response = {};
    apiPairs.forEach(pair => {
        response[keyMapping[pair.name.toUpperCase()]] = pair;
    })

    // on-chain version
    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i]
        response[keyMapping[pair]].lpPoolPriceChain = await raydium.getLpPoolPrice(pair)
    }
    return response
}

exports.collect_raydium = collect_raydium;
