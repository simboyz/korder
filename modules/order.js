/*global global, require, console, module*/
/*jslint this:true, for:true*/
(function () {

    'use strict';

    var fs = require('fs');
    var moment = require('moment');
    var request = require('request');

    var common = require('./common');
    var logWriter = require('./logWriter');

    var orderNumMaker = function (callback) {
        callback('FB' + moment().format('HHmmssSSS'));
    };

    var _OrderEx = function (location, body, callback) {
        logWriter('ORDER-BODY', body);
        request({
            url: location + '?apikey=' + common.LOGIN_APIKEY,
            headers: {
                'Content-Type': 'application/json'
            },
            body: body,
            method: 'POST'
        }, function (error, response) {
            if (error) {
                console.log(error);
                callback();
            }
            var res = JSON.parse(response.body);
            callback(res);
        });
    };

    var order = function (order, callback) {
        orderNumMaker(function (clientOrderId) {
            var bodyStr = JSON.stringify({
                header: {
                    senderCompId: common.BUSINESS_ID,
                    deliverToCompId: order.securitycode
                },
                body: {
                    clOrdID: clientOrderId,
                    account: order.account,
                    handlInst: '1',
                    symbol: order.symbol,
                    side: order.side,
                    orderQty: order.orderQty,
                    ordType: order.ordType || '2',
                    price: order.price
                }
            });
            order.clOrdID = clientOrderId;
            common.executionReport[clientOrderId] = order.socketid;

            /* 주문데이터 로그 저장 */
            fs.appendFile('./logs/' + moment().format('YYYYMMDD') + '.orders', JSON.stringify(order) + '\n', 'utf8');
            _OrderEx(common.url.order, bodyStr, callback);
        });
    };

    module.exports = order;
}());