const Web3 = require('web3');
const aaveLending_abi = require('./abis/aaveLending_abi')
//address
const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
const lendingPool = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9'

async function aaveLending_usdt(){
    try{
        const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`)
        const poolContract = new web3.eth.Contract(aaveLending_abi, lendingPool)
        const lendingdata = await poolContract.methods.getReserveData(usdtAddress).call()
        const currentLendingRate = await lendingdata[3]/1e25
        const stableBorrowRate = await lendingdata.currentStableBorrowRate/1e25
        const variedBorrowRate = await lendingdata.currentVariableBorrowRate/1e25
        //console.log('lending rate: ' + currentLendingRate + '%, Stable borrow rate: ' + stableBorrowRate +'%, Varied borrow rate: ' +variedBorrowRate + '%')
        
        return{
            currentLendingRate,
            stableBorrowRate,
            variedBorrowRate,
        }
    }
    catch(error){
        console.log(error)
    }
}

exports.aaveLending_usdt = aaveLending_usdt;