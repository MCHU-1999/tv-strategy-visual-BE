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
 * @param {Number} backtestDays 
 * @param {String} endDate 
 */
async function preference(client, backtestDays = 30, endDate = getDate()){
  try {
    const db = client.db("ha");
    let historyDB = db.collection("historyPos");
    
    const endTimestamp = moment(`${ endDate } 23:59:59`).tz("Asia/Taipei").format("X");
    const startTimestamp = endTimestamp - (86400 * backtestDays) + 1;
    
    const query = { closeTimestamp: { $gte: startTimestamp } };

    const history = await historyDB.find(query).toArray();
    const obj = {};
    if (history.length === 0) {
      console.log('history DB is empty!');
      return false;
    } else {
      var positionCount = 0;
      var size, tokenname, closeTimestamp, leverage, day, fee, pnl;
      for (let eachTrade of history){
        positionCount += 1;
        leverage = eachTrade.leverage;
        // 手續費6%, 開倉平倉各付一次
        fee = 0.0006 * eachTrade.cost * leverage * 2;
        pnl = parseFloat(eachTrade.profit) - fee;
        size = Object.keys(obj).length;  // Get the size of the object
        //if (size < 4) {
        tokenname = eachTrade.symbol;
        if (obj.hasOwnProperty(tokenname)) {
          obj[tokenname][0] += 1;
          obj[tokenname][1] += pnl;
        } else {
          obj[tokenname] = [1, pnl];
        }
        //} else {
        //   if (obj.hasOwnProperty('Others')) {
        //     obj['Others'][0] += 1;
        //     obj['Others'][1] += pnl;
        //   } else {
        //     obj['Others'] = [1, pnl];
        //   }
        // }
      }

      const sortedObj = Object.entries(obj)
        .sort((a, b) => b[1][0] - a[1][0])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      // Calculate the ratio per element
      let tradingPair = [];
      let ratio = [];
      let trades = [];
      let pnls = [];
      let name = [];
      for (const key in sortedObj) {
        //if (key !== 'Others') {
        tradingPair.push(key);
        name.push(key.split('U')[0]);
        ratio.push((sortedObj[key][0] / positionCount));
        trades.push(sortedObj[key][0]);
        pnls.push(sortedObj[key][1]);
        //}
      }
      
      // tradingPair.push('Others');
      // ratio.push((sortedObj['Others'][0] / positionCount));
      // trades.push(sortedObj['Others'][0]);
      // pnls.push(round(sortedObj['Others'][1], 2))
  
      return {
        "tradingPair": tradingPair,
        "name": name,
        "ratio": ratio,
        "trades": trades,
        "pnl": pnls,
      };
    }
  }catch(errorMsg){
    console.log(errorMsg);
  }
}

/* eslint-enable no-unused-vars */
module.exports = { preference };

/**
 * 1. history和current是直接拿DB資料就好對嗎?
 * 2. 資料庫是否需要有user欄位，不然每個人都得有兩個不同的db?
 * 3. 需要標記價格和預估強平價嗎，標記價格是透過API拿嗎
 * 4. 品種偏好我是持和平倉的都統計嗎還是只看平倉的，平倉的應該是依照平倉時間來統計?e.g.平倉時間在30天內
 */