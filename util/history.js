require('dotenv').config();
const moment = require('moment-timezone');
const { MongoClient } = require('mongodb');
// const Srand = require('seeded-rand');
// const { std, sqrt, mean, sum, max } = require('mathjs');

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
async function tradeHistory(client){
  try {
    const db = client.db("ha");
    let historyDB = db.collection("historyPos");
    const history = await historyDB.find({}).toArray();
  
    if (history.length === 0) {
      console.log('history DB is empty!');
      return false;
    } else {
  
      let pair = [];
      let side = [];
      let leverage = [];
      let size = [];
      let cost = [];
      let openTime = [];
      let openPrice = [];
      let closeTime = [];
      let closePrice = [];
      let profit = [];
      let profitPercent = [];

      for (let eachTrade of history){
        pair.push(eachTrade.symbol);
        side.push(eachTrade.side);
        leverage.push(eachTrade.leverage);
        size.push(eachTrade.size);
        cost.push(round(eachTrade.cost, 2));
        openTime.push(getDate(eachTrade.openTimestamp));
        openPrice.push(round(eachTrade.openPrice, 2));
        closeTime.push(getDate(eachTrade.closeTimestamp));
        closePrice.push(round(eachTrade.closePrice, 2));
        profit.push(round(eachTrade.profit, 2));
        profitPercent.push(eachTrade.profitPercent);
      }

      return {
        "pair": pair,
        "side": side,
        "leverage": leverage,
        "size": size,
        "cost": cost,
        "openTime": openTime,      
        "openPrice": openPrice,                    
        "closeTime": closeTime,
        "closePrice": closePrice,
        "profit": profit,   
        "ROI": profitPercent,
      };
    }
  }catch(errorMsg){
    console.log(errorMsg);
  }
}

/* eslint-enable no-unused-vars */
module.exports = { tradeHistory };