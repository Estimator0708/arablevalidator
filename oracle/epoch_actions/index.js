const {setRewardRate} = require('./updateRewardRate');

async function setter(){
    await setRewardRate();
}

exports.setter = setter;