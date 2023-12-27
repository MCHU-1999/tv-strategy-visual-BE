require('dotenv').config();
const moment = require('moment-timezone');
const { MongoClient } = require('mongodb');
const ccxt = require ('ccxt');
// const Srand = require('seeded-rand');
// const { std, sqrt, mean, sum, max } = require('mathjs');

const bitgetKey = process.env.BITGET_API_KEY;
const bitgetSecret = process.env.BITGET_SECRET_KEY;
const passphrase = process.env.BITGET_PASSPHRACE;


let bitgetAccount = new ccxt.bitget({
    apiKey: bitgetKey,
    secret: bitgetSecret,
    password: passphrase
});


moment.tz.setDefault("Asia/Taipei");
const mongoClient = MongoClient;

function getDate(ts = undefined) {
  if (ts === undefined) {
    return moment( Date.now() ).tz("Asia/Taipei").format("YYYY-MM-DD"); 
  } else {
    // console.log(ts);
    return moment.unix( ts ).tz("Asia/Taipei").format("YYYY-MM-DD HH:mm:ss"); 
  }
}

function round(numToBeRound, digits){
  return Math.round((numToBeRound + Number.EPSILON)*(10**digits)) / (10**digits);
}

/* eslint-disable no-unused-vars */
/**
 * @param {mongoClient} client 
 */
async function currentPos(client){
  try {
    const db = client.db("ha");
    let currentDB = db.collection("currentPos");
    //const current = await currentDB.find({}).skip(page*10).limit((page+1)*10).toArray();
    const current = await currentDB.find({}).toArray();
    if (current.length === 0) {
      console.log('current DB is empty!');
      return false;
    } else {
      let pair = [];
      let side = [];
      let size = [];
      let cost = [];
      let openTime = [];
      let leverage = [];
      let openPrice = [];
      for (let eachTrade of current){
        pair.push(eachTrade.symbol);
        side.push(eachTrade.side);
        size.push(eachTrade.size);
        cost.push(round(eachTrade.cost, 2));
        leverage.push(eachTrade.leverage);
        openTime.push(getDate(eachTrade.openTimestamp));
        openPrice.push(round(eachTrade.openPrice, 2));
      }
      // 'ETHUSDT'
      // 'BTCUSDT_UMCBL'
      pair_umcbl = pair.map(i => i + '_UMCBL');
      let fetch = await bitgetAccount.fetchTickers(pair_umcbl);
      let values = Object.values(fetch).map(i => i.last);
      let keys = Object.values(fetch).map(i => i.info.symbol.split('_')[0]);
      
      const price = keys.reduce((obj, key, index) => {
        obj[key] = values[index];
        return obj;
      }, {});

      return {
        "pair": pair,
        "side": side,
        "size": size,
        "cost": cost,
        "leverage": leverage,
        "openTime": openTime,
        "openPrice": openPrice,
        "nowPrice": price,
      };
    }
  }catch(errorMsg){
    console.log(errorMsg);
  }
}

/* eslint-enable no-unused-vars */
module.exports = { currentPos };