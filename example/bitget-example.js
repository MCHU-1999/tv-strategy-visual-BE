const ccxt = require ('ccxt');
// const { type } = require('os');
// const { BitgetApi } = require('../src/tts-bitget');
require("dotenv").config();


// --------------------------------------------------------------------------------------------------------
// API keys & exchange object setup
// --------------------------------------------------------------------------------------------------------
const bitgetKey = process.env.BITGET_API_KEY;
const bitgetSecret = process.env.BITGET_SECRET_KEY;
const passphrase = process.env.BITGET_PASSPHRACE;


let bitgetAccount = new ccxt.bitget({
    apiKey: bitgetKey,
    secret: bitgetSecret,
    password: passphrase
});

// let bitgetAccount = new BitgetApi({
//     apiKey: "bg_aa19d9f6c55a995a6cfb559df2cbc8bc",
//     secret: "8e76460c52f185cf10f50f768387f971f9bd780e09bff5b634c2a8f8d7afac2c",
//     password: "a0966910483001"
// });


// --------------------------------------------------------------------------------------------------------
// Functions to be test
// --------------------------------------------------------------------------------------------------------

(async function() {
    try{
        // Checkout what bitget has
        // console.log(bitgetAccount.has);

        // Load Market
        // await bitgetAccount.loadMarkets('USDT');

        // Fetch Account Info
        // console.log(await bitgetAccount.fetchAccountInfo('ETH/USDT:USDT'));

        // Check Precision
        // console.log(bitgetAccount.market('ETH/USDT:USDT'));

        // Fetch Ticker
        let a = await bitgetAccount.fetchTicker('LQTYUSDT_UMCBL');
        // console.log(a);
        console.log(a['last']);
        // console.log(await bitgetAccount.fetchTickers(['BTC/USDT:USDT']));
        // console.log(await bitgetAccount.fetchAllTickers('USDT'));

        // Fetch Mark Price
        // console.log(await bitgetAccount.fetchMarkPrice('BTC/USDT:USDT'));

        // Fetch Position
        // console.log(await bitgetAccount.fetchPositions(undefined, 'USDT', true));
        // console.log(await bitgetAccount.fetchPosition('ETC/USDT:USDT', true));

        // Set Leverage, MarginMode, PositionMode
        // console.log(await bitgetAccount.setLeverage(20, 'ETH/USDT:USDT'));
        // console.log(await bitgetAccount.setMarginMode('cross', 'ETH/USDT:USDT'));
        // console.log(await bitgetAccount.setPositionMode(true, 'ETH/USDT:USDT'));

        // Create Order
        // console.log(await bitgetAccount.createOrder(
        //     'ETH/USDT:USDT',
        //     'market',
        //     'buy',
        //     0.30,
        //     1000,
        //     {
        //         stopLossPrice: 1000,
        //         // takeProfitPrice: 1900,
        //         // clientOrderId: 'CCXT-bitget-test',
        //         reduceOnly: true,
        //     }
        // ));

        // Cancel Order
        // console.log(await bitgetAccount.cancelOrder('1019101065375617027', 'ETH/USDT:USDT'));
        // console.log(await bitgetAccount.cancelAllOrders('ETH/USDT:USDT', 'USDT'));
        // console.log(await bitgetAccount.cancelAllOrders(undefined, 'USDT'));

        // Fetch Order
        // console.log('fetchOrder');
        // console.log(await bitgetAccount.fetchOpenOrders('ETH/USDT:USDT', undefined, undefined, 100 ));
        // console.log(await bitgetAccount.fetchOpenOrders(undefined, 'USDT', undefined, 100 ));
        // console.log(await bitgetAccount.fetchClosedOrders('BTC/USDT:USDT', undefined, 100 ));
        // console.log(await bitgetAccount.fetchClosedOrders(undefined, undefined, 100 ));
        // console.log(await bitgetAccount.fetchOrder('1016990366313287680', 'ETH/USDT:USDT', undefined));

        // // Fetch Plan Order
        // console.log(await bitgetAccount.fetchPlan('ETH/USDT:USDT', 'profit_loss'));      // TPSL
        // console.log(await bitgetAccount.fetchPlan('ETH/USDT:USDT', 'plan'));             // PLAN

        // // Cancel PLAN Order
        // console.log(await bitgetAccount.cancelPlan('1019106604943904771', 'ETH/USDT:USDT', 'loss_plan'));
        // console.log(await bitgetAccount.cancelAllPlan('USDT', 'profit_plan'));

    }catch(errorMsg){
        console.log(errorMsg);
    }
})();

