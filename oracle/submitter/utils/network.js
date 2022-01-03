const Web3 = require('web3');
const { fuji_url, avax_url } = require('../../../config/config.rpc');

function setup(){
  return new Web3(fuji_url);
}


// async function test3() {
//   const test2 = await test1();
//   if(test2 ==1){
//     return new Web3(avax_url);
//   } else if(test2==2){
//     return new Web3(fuji_url);
//   }
// };


// exports.test1 = test1;
exports.setup = setup;