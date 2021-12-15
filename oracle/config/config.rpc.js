require("dotenv").config();
const bsc_url = 'https://bsc-dataseed1.binance.org:443';
const eth_url = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
const poly_url = `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY_POLY}`;
const fuji_url = 'https://api.avax-test.network/ext/bc/C/rpc';
const avax_url = 'https://api.avax.network/ext/bc/C/rpc';

exports.bsc_url = bsc_url;
exports.eth_url = eth_url;
exports.poly_url = poly_url;
exports.fuji_url = fuji_url;
exports.avax_url = avax_url;