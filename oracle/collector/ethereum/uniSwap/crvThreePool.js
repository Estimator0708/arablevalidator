const Web3 = require('web3');
const {totalGauageAddress, gaugeAddress} = require('../../libs/address');
const {gauageThreePool_abi, totalGauage_abi  } = require('../../libs/abis');
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
        console.log(error)
    }
}
exports.crv_three_pool = crv_three_pool;

