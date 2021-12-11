const Web3 = require('web3');
const totalGauage_abi = require('./abis/totalGauage_abi')
const gauageThreePool_abi = require('./abis/gauageThreePool_abi');

//address
const totalGauageAddress = '0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB'
const gaugeAddress = '0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A'
const percent =100

async function crv_three_pool(){
    try{
        const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`)
        const totalGauageContract = new web3.eth.Contract(totalGauage_abi, totalGauageAddress)
        const threePoolContract = new web3.eth.Contract(gauageThreePool_abi, gaugeAddress)
        //getting the gauage weight of 3pool
        const getGauageWeight = await totalGauageContract.methods.get_gauge_weight(gaugeAddress).call()
        const totalGauageWeight = await totalGauageContract.methods.get_total_weight().call()
        const threePoolWeightPercentDecimal = totalGauageWeight/getGauageWeight
        const threePoolWeightPercent = threePoolWeightPercentDecimal/1e19
        const curveInflation = await threePoolContract.methods.inflation_rate().call()
        const curveMintedPerSecond = curveInflation/1e18
        const threePoolReward = (curveMintedPerSecond * threePoolWeightPercent)/percent
       // console.log(`3 pool rate: ${threePoolWeightPercent} %. ${curveMintedPerSecond} CRV is getting minted per second. ${threePoolReward} CRV getting rewarded to a 3 Pool.`)

        return{
            curveMintedPerSecond,
            threePoolReward,
        }
    }
    catch(error){
    }
}
exports.crv_three_pool = crv_three_pool;

