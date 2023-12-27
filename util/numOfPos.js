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
async function numberOfPos(client){
  try {
    const db = client.db("ha");
    let currentDB = db.collection("currentPos");
    //const current = await currentDB.find({}).skip(page*10).limit((page+1)*10).toArray();
    const current = await currentDB.find({}).toArray();
    if (current.length === 0) {
      console.log('current DB is empty!');
      return false;
    } else {

      return {
        "num": current.length,
      };
    }
  }catch(errorMsg){
    console.log(errorMsg);
  }
}

/* eslint-enable no-unused-vars */
module.exports = { numberOfPos };