const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000
const raydium = require('./lib/raydium.js')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/rayweb/lp-token-price/:pair', (req, resp) => {
  let reqPair = req.params.pair.toUpperCase()
  function getPairs() {
    return axios.get('https://api.raydium.io/pairs').then(response => response.data)
  }
  getPairs()
    .then(data => {
      let pairs = data.filter(pair => pair.name == reqPair)
      if (pairs.length != 1) {
        resp.send(reqPair + ' not found')
      } else {
        let pair = pairs[0]
        resp.send(reqPair + ' LP token price ' + pair.lp_price + '\n')
      }
    })
    .catch(err => {
      console.log(err.message)
      resp.send('Failed to load LP token price for ' + reqPair)
    })
})

app.get('/sdk/lp-token-price/:pair', (req, resp) => {
  let pair = req.params.pair.toUpperCase()
  raydium.getLpPoolPrice(pair)
    .then(price => {
      resp.send(pair + ' LP token price ' + price + '\n')
    })
    .catch(err => {
      console.log(err.message)
      resp.send('Failed to load LP token price for ' + reqPair)
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

