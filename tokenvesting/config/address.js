const chainId = Number(process.env.CHAIN_ID || '43113');

const contracts = {
  43113: {
    // testnet
    arableVesting: '0x567b32C78D6275e3575Daa676BbDC3720123B0c8',
    rootDistributor: '0xD0a96D7E8765EB9fb3702246AbA7F5e5e42B4a0B',
    teamDistributor: '0x6b16Ea70e82DefDe1bE123224C124cdBC9A065Cf',
    stakingRoot: '0x78f1442f97dbacC79F1d4C74d3097Dc460d93672',
    staking: '0x96C726cC2Fe6121f8f69ea31594B33f14Ab00d11',
    farming: '0x82bd5ba2ad6aDF7aa1bCb78527d2ab00F6956094',
    otc: '0x363f67e27224779c77633C5296ca22dA2b614693',
  },
  43114: {
    // mainnet
    arableVesting: '',
    rootDistributor: '',
    teamDistributor: '',
    stakingRoot: '',
    staking: '',
    farming: '',
    otc: '',
  },
};

const {
  arableVesting: arable_vesting,
  rootDistributor: root_distributer,
  teamDistributor: team_distributer,
  stakingRoot: staking_root,
  staking,
  farming,
  otc,
} = contracts[chainId];

exports.arable_vesting = arable_vesting;
exports.root_distributer = root_distributer;
exports.team_distributer = team_distributer;
exports.staking_root = staking_root;
exports.staking = staking;
exports.farming = farming;
exports.otc = otc;
