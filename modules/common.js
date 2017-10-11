/*global module, require, console, setTimeout, process*/
/*jslint this:true, for:true*/
(function () {

    "use strict";

    var fs = require('fs');
    var prefix = JSON.parse(fs.readFileSync('prefix_test.json', 'utf-8'));
    var urlMaker = function (str) {
        return 'https://' + prefix.SANDBOX + 'apigw.koscom.co.kr/v1/' + str;
    };
    console.log(prefix);
    var common = {
        BUSINESS_ID: prefix.BUSINESS_ID,
        LOGIN_APIKEY: prefix.LOGIN_APIKEY,
        QUERY_APIKEY: prefix.QUERY_APIKEY,
        QUERY_SECRET: prefix.QUERY_SECRET,
        COMID: prefix.COMID,
        WSURI: 'ws://' + prefix.SANDBOX + 'apigw.koscom.co.kr:9700/restAcceptor/exec',
        TOKEN: null,
        url: {
            login: urlMaker('order/admin/login'),
            logout: urlMaker('order/admin/logout'),
            order: urlMaker('order/single/new'),
            accountlist_search: urlMaker('samsung/b2baccount/accountlist/search'),
            balance_search: urlMaker('samsung/b2baccount/balance/search'),
            orderdetail_search: urlMaker('samsung/b2baccount/orderdetail/search'),
            settlelist_search: urlMaker('samsung/b2baccount/settlelist/search'),
            tradebook_search: urlMaker('samsung/b2baccount/tradebook/search')
        },
        socketClient: {},
        executionReport: {},
        processExit: function () {
            setTimeout(function () {
                process.exit();
            }, 1000);
        }
    };

    module.exports = common;

}());