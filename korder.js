/*global global, require, console, setTimeout, process, Buffer*/
(function () {

    'use strict';

    process.WEBPORT = 3333;

    var fs = require('fs');
    var _ = require('underscore');
    var async = require('async');
    var moment = require('moment');
    var Stomp = require('stompjs');
    var request = require('request');
    var fexpress = require('fabotexpress')();
    var app = fexpress[0];
    var server = fexpress[1];
    var logWriter = require('./modules/logWriter');
    var common = require('./modules/common');
    var socketmgr = require('./modules/socketmgr');
    var login = require('./modules/login');
    var order = require('./modules/order');
    var logout = require('./modules/logout');
    var _apikey = common.QUERY_APIKEY;
    var _secret = common.QUERY_SECRET;
    var auth = 'Basic ' + new Buffer(_apikey + ':' + _secret).toString('base64');
    global.orderCount = 0;

    var exitHandler = function (error) {
        if (error) {
            logWriter('================ERROR===============');
            logWriter(error);
            logWriter('====================================');
            logWriter("err.message:", error.message);
            setTimeout(function () {
                process.exit();
            }, 1000 * 2);
        } else {
            logout(common.processExit);
        }
    };
    var exitEvent = function () {
        process.stdin.resume();
        process.on('exit', exitHandler);
        process.on('SIGINT', exitHandler);
        process.on('uncaughtException', exitHandler);
    };
    exitEvent();

    var createWSSession = function (token) {
        common.TOKEN = token;

        var client = Stomp.overWS(common.WSURI);
        var topic = '/topic/' + token;
        console.log(topic);
        client.connect({}, function () {
            client.subscribe(topic, function (data) {
                var res = JSON.parse(data.body);
                logWriter('\n>>>>> 체결\n', data.body);
                fs.appendFile('./logs/' + moment().format('YYYYMMDD') + '.conclusion', JSON.stringify(res) + '\n', 'utf8');
                _.each(common.socketClient, function (dd) {
                    dd.emit('CONCLUSION', res.body);
                });
            });
        });
    };

    var logintry = function (token) {
        if (token === null || token === undefined) {
            logout(common.processExit);
        } else {
            createWSSession(token);
        }
    };

    var requestQuery = function (url, bodyStr, res) {
        request({
            url: url,
            body: JSON.stringify(bodyStr),
            headers: {
                'comId': common.COMID,
                'Content-Type': 'application/json',
                'Authorization': auth
            },
            method: 'POST'
        }, function (error, response) {
            if (error) {
                console.log(error);
            }
            logWriter('response-body:\n', response.body);
            res.send({
                result: JSON.parse(response.body)
            });
        });
    };

    var routes = {
        logout: function (app) {
            app.get('/logout', function () {
                logWriter('SERVER SHUTDOWN', '');
                logout(function () {
                    setTimeout(function () {
                        process.exit();
                    }, 1000);
                });
            });
        },
        order: function (app) {
            app.post('/order', function (req, res) {
                order(req.body, function (response) {
                    logWriter('ORDER-CMPL', response);
                    res.send({
                        result: response
                    });
                });
            });
        },
        balance: function (app) {
            app.post('/balance_search', function (req, res) {
                var bd = req.body;
                requestQuery(common.url.balance_search, {
                    partner: {
                        comId: bd.comId,
                        srvId: bd.srvId
                    },
                    commonHeader: {
                        reqIdConsumer: bd.reqIdConsumer
                    },
                    balanceListRequestBody: {
                        queryParameter: {
                            qrAccNo: bd.qrAccNo,
                            qrAssetType: 'EQTY',
                            count: 0,
                            page: null
                        }
                    }
                }, res);
            });
        },
        accountlist: function (app) {
            app.post('/accountlist_search', function (req, res) {
                var bd = req.body;
                requestQuery(common.url.accountlist_search, {
                    partner: {
                        comId: bd.comId,
                        srvId: bd.srvId
                    },
                    commonHeader: {
                        reqIdConsumer: bd.reqIdConsumer
                    },
                    accountListRequestBody: {
                        queryParameter: {
                            count: 0,
                            page: null
                        }
                    }
                }, res);
            });
        }
    };
    async.waterfall([
        function (callback) {
            logWriter('LOGIN', '');
            login(logintry);
            callback();
        }
    ], function () {
        socketmgr(server);
        routes.logout(app);
        routes.order(app);
        routes.balance(app);
        routes.accountlist(app);
    });
}());