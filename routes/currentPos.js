require('dotenv').config();
var cors = require('cors');
const express = require('express');
const router = express.Router();
const { currentPos } = require('../util/current');
const { numberOfPos } = require('../util/numOfPos');
const { MongoClient } = require('mongodb');

const mongoClient = MongoClient;
const mongoURI = process.env.MONGODB;
const client = new mongoClient(mongoURI);
console.log('new DB client! (bitget)');

const wrongPasswordMsg = "Invalid Password!";
const apiPassword = process.env.API_PASSWORD;


router.post('/getCurrentPos', async (req, res) => {
  try{
    const password = req.header('password');
    if (password !== apiPassword) {
      res.status(417).send({
        status: 'error',
        msg: wrongPasswordMsg
      });
      res.end();
    }else{
      result = await currentPos(client);
      console.log('currentPos()');
      if (result === false) {
        // no data!
        res.status(200).send({
          status: 'success',
          data: {},
        });
        res.end();
      } else {
        // console.log(result);
        res.status(200).send({
          status: 'success',
          data: result,
        });
        res.end();
      }
    }
  }catch (errorMsg) {
    console.log(`error: ${errorMsg}`);
    res.status(417).send({
      status: 'error',
      data: errorMsg,
    });
    res.end();
  }
});

router.get('/getNumOfPos', async (req, res) => {
  try{
    const password = req.header('password');
    if (password !== apiPassword) {
      res.status(417).send({
        status: 'error',
        msg: wrongPasswordMsg
      });
      res.end();
    }else{
      result = await numberOfPos(client);
      console.log('numberOfPos()');
      if (result === false) {
        // no data!
        res.status(200).send({
          status: 'success',
          data: {},
        });
        res.end();
      } else {
        // console.log(result);
        res.status(200).send({
          status: 'success',
          data: result,
        });
        res.end();
      }
    }
  }catch (errorMsg) {
    console.log(`error: ${errorMsg}`);
    res.status(417).send({
      status: 'error',
      data: errorMsg,
    });
    res.end();
  }
});

module.exports = router;