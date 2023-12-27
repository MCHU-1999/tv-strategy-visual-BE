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
    return moment.unix( ts ).tz("Asia/Taipei").format("YYYY-MM-DD"); 
  }
}

function round(numToBeRound, digits){
  return Math.round((numToBeRound + Number.EPSILON)*(10**digits)) / (10**digits);
}

/* eslint-disable no-unused-vars */
/**
 * @param {mongoClient} client 
 * @param {Number} backtestDays 
 * @param {String} endDate 
 */
async function tradeOverview(client, backtestDays = 30, endDate = getDate()){
  try {
    const db = client.db("ha");
    let historyDB = db.collection("historyPos");
    const endTimestamp = moment(`${ endDate } 23:59:59`).tz("Asia/Taipei").format("X");
    const startTimestamp = endTimestamp - (86400 * backtestDays) + 1;
    
    const winQuery = { closeTimestamp: { $gte: startTimestamp }, profit: { $gte: 0.00 } };
    const loseQuery = { closeTimestamp: { $gte: startTimestamp }, profit: { $lt: 0.00 } };

    const history = await historyDB.find({}).toArray();
    const win = await historyDB.find(winQuery).toArray();
    const lose = await historyDB.find(loseQuery).toArray();

    if (win.length === 0 && lose.length === 0) {
      console.log('history DB is empty!');
      return false;
    } else {
      const totalTxn = win.length+lose.length;

      var profit = 0.00;
      var leverage, fee, pnl;
      for (let eachTrade of history){
        leverage = eachTrade.leverage;
        fee = 0.0006 * eachTrade.cost * leverage * 2;
        pnl = parseFloat(eachTrade.profit) - fee;
        profit += pnl;
      }

      var totalProfit = 0.00, maxProfit = 0.00, maxProfitpercent = 0.00;

      if (win.length !== 0){
        totalProfit = win.reduce((sum, entry) => sum + entry.profitPercent, 0);
        maxProfit = Math.max(...win.map(entry => entry.profit));
        const entry = win.find(entry => entry.profit === maxProfit);
        maxProfitpercent = entry.profitPercent;
      }

      var totalLoss = 0.00, maxLoss = 0.00, minProfitpercent = 0.00;
      if (lose.length !== 0){
        totalLoss = lose.reduce((sum, entry) => sum + entry.profitPercent, 0);
        maxLoss = Math.min(...lose.map(entry => entry.profit));
        const entry = lose.find(entry => entry.profit === maxLoss);
        minProfitpercent = entry.profitPercent;
      }

      // const avgProfit = (totalProfit/win.length);
      // const avgLoss = (totalLoss/lose.length);

      const totalPercent = totalLoss + totalProfit;
      
      const timeDifferences = history.map(entry => entry.closeTimestamp - entry.openTimestamp);
      const totalDuration = timeDifferences.reduce((total, duration) => total + duration, 0);

      return {
        "total": round(profit, 2),
        "totalPercent": round(totalPercent, 2),
        "totalTxn": totalTxn,
        "winTxn": win.length,
        "loseTxn": lose.length,
        "winRatio": win.length/totalTxn,
        "avgTime": totalDuration,
        "maxProfit": maxProfit,
        "maxLoss": maxLoss,
        "maxProfitPercent": round(maxProfitpercent, 0),
        "minProfitPercent": round(minProfitpercent, 0),
        // "pnlRatio": round((avgProfit/avgLoss), 1),
      };
    }
  }catch(errorMsg){
    console.log(errorMsg);
  }
}

/* eslint-enable no-unused-vars */
module.exports = { tradeOverview };