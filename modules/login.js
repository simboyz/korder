/*global require, console, module*/
/*jslint this:true, for:true*/
(function () {

    'use strict';

    var fs = require('fs');
    var request = require('request');
    var common = require('./common');
    var logWriter = require('./logWriter');

    var tokenCheck = function (token) {
        if (token === undefined) {
            logWriter('WARNING! Duplicate login, token is undefined.');
            return undefined;
        } else {
            logWriter('LOGIN SUCCESS', 'TOKEN: ' + token);
            fs.writeFileSync('koscom.token', token);
            return token;
        }
    };

    var _body = {
        header: {
            senderCompId: common.BUSINESS_ID
        },
        body: {}
    };

    var opt = {
        url: common.url.login + '?apikey=' + common.LOGIN_APIKEY,
        body: JSON.stringify(_body),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
    };

    var login = function (callback) {
        request(opt, function (error, response) {
            if (error) {
                logWriter('LOGIN ERROR', error);
                callback();
            }
            var token = JSON.parse(response.body).body.token;
            callback(tokenCheck(token));
        });
    };
    module.exports = login;
}());