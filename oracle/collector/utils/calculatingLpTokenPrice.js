function calculateLpTokenPrice(tokenOneSupply, tokenOnePrice, tokenTwoSupply, tokenTwoPrice, totalSupply ){
    const totalLiquidity = tokenOneSupply*tokenOnePrice + tokenTwoSupply*tokenTwoPrice;
    const lpTokenPrice = totalLiquidity/totalSupply;

    return{
        lpTokenPrice,
    }
}

exports.calculateLpTokenPrice = calculateLpTokenPrice; 
