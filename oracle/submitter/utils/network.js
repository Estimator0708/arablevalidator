const Web3 = require('web3');
const { fuji_url, avax_url } = require('../../config/config.rpc');

exports.setup = function () {
    return new Web3(fuji_url)
}