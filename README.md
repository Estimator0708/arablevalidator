# Arable Validator Scripts

## Install dependencies

`npm install`

## Start App

`node app.js`

## Get prices with Raydium public API

```
curl http://localhost:3000/rayweb/lp-token-price/ray-sol
curl http://localhost:3000/rayweb/lp-token-price/ray-usdt
```

## Get prices with Raydium SDK and Solana web3.js (currently incorrect)

```
curl http://localhost:3000/sdk/lp-token-price/ray-sol
curl http://localhost:3000/sdk/lp-token-price/ray-usdt
```

## How to ensure the security of oracle script

Oracle script verification process

- Verified by the native chain members (developers / trusted parties)
- Verified by Arable protocol governance

To avoid the mismatch between oracle script and native chain information

- Beacon address will be available on native chain that is monitored
- If there's mismatch between beacon address and oracle script for more than the threshold, synthetic farm should be stopped
- To avoid mismatch, synthetic farm could use previous epoch's information on beacon address
- Another option is to let the native chain trusted parties to be the oracle provider by staking some of their tokens as collateral.

## Oracle security when oracle script itself is secure

- On testnet phase, the oracle script could rely on api services
- On mainnet phase, it should be fully decentralized and should be connecting to different nodes to collect information

At the first stage, internal oracles are acceptable for small farms but as time goes, oracle provider role should be delegated to third parties.
