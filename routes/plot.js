require('dotenv').config();
var cors = require('cors');
const express = require('express');
const router = express.Router();
const { fundChange } = require('../util/db-query');
const { preference } = require('../util/preference');
const { MongoClient } = require('mongodb');

const mongoClient = MongoClient;
const mongoURI = process.env.MONGODB;
const client = new mongoClient(mongoURI);
console.log('new DB client! (bitget)');

const wrongPasswordMsg = "Invalid Password!";
const apiPassword = process.env.API_PASSWORD;


router.post('/getlineChart', async (req, res) => {
  try{
    const password = req.header('password');
    if (password !== apiPassword) {
      res.status(417).send({
        status: 'error',
        msg: wrongPasswordMsg
      });
      res.end();
    }else{
      console.log(req.body);
      const backtestDays = req.body.backtestDays;
      result = await fundChange(client, backtestDays);
      console.log('fundChange()');
      if (result === false) {
        // no data!
        res.status(200).send({
          status: 'success',
          data: {},
        });
        res.end();
      } else {
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

router.post('/getPieChart', async (req, res) => {
  try{
    const password = req.header('password');
    if (password !== apiPassword) {
      res.status(417).send({
        status: 'error',
        msg: wrongPasswordMsg
      });
      res.end();
    }else{
      console.log(req.body);
      const backtestDays = req.body.backtestDays;
      result = await preference(client, backtestDays);
      console.log('preference()');
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
    console.log("test");
    console.log(`error: ${errorMsg}`);
    res.status(417).send({
      status: 'error',
      data: errorMsg,
    });
    res.end();
  }
});

module.exports = router;