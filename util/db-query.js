require('dotenv').config();
const moment = require('moment-timezone');
const { MongoClient } = require('mongodb');

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
function getTime() {
  return moment( Date.now() ).tz("Asia/Taipei").format("YYYY-MM-DD HH:mm:ss"); 
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
async function fundChange(client, backtestDays = 30, endDate = getDate(), fund = 1000){
  try {
    const db = client.db("ha");
    let historyDB = db.collection("historyPos");
    const history = await historyDB.find({}).toArray();
  
    if (history.length === 0) {
      console.log('history DB is empty!');
      return false;
    } else {
      var positionCount = 0;
      const endTimestamp = moment(`${ endDate } 23:59:59`).tz("Asia/Taipei").format("X");
      const startTimestamp = endTimestamp - (86400 * backtestDays) + 1
      // console.log(startTimestamp);
      var pnlInDays = Array(backtestDays).fill(0.0);
      var profit = 0.00;
  
      var openTimestamp, closeTimestamp, leverage, day, fee, pnl;
      for (let eachTrade of history){
        openTimestamp = eachTrade.openTimestamp
        closeTimestamp = eachTrade.closeTimestamp
        leverage = eachTrade.leverage;

        if ((startTimestamp <= closeTimestamp) && (closeTimestamp <= endTimestamp)){
          positionCount += 1;
          day = parseInt((closeTimestamp-startTimestamp)/86400);
          // 手續費6%, 開倉平倉各付一次
          fee = 0.0006 * eachTrade.cost * leverage * 2;
          pnl = parseFloat(eachTrade.profit) - fee;
          pnlInDays[day] += pnl;
          profit += pnl;
        }
      }
  
      let x = [];
      let y = [];
      y.push(parseFloat(pnlInDays[0]+fund));
      for(let i=0; i<pnlInDays.length; i++){
        x.push(getDate(startTimestamp + 86400*i));
        if (i !== 0){
          y.push(parseFloat(pnlInDays[i] + y[i - 1]));
        }
      }
  
      return {
        "positionCount": positionCount,       // 總計開倉數
        "pnlInDays": pnlInDays,               // 每日收益
        "profit": round(profit, 2),           // 跟單收益
        "chartX": x,
        "chartY": y,
      };
    }
  }catch(errorMsg){
    console.log(errorMsg);
  }
}

/* eslint-enable no-unused-vars */
module.exports = { fundChange };