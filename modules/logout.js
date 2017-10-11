/*global require, console, module*/
/*jslint this:true, for:true*/
(function () {

    'use strict';

    var request = require('request');
    var common = require('./common');

    var _body = {
        header: {
            senderCompId: common.BUSINESS_ID
        }
    };

    var callLogout = function (body, callback) {
        request({
            url: common.url.logout + '?apikey=' + common.LOGIN_APIKEY,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        }, function (error) {
            if (error) {
                console.log(error);
                callback();
            } else {
                callback();
            }
        });
    };

    var logout = function (callback) {
        callLogout(JSON.stringify(_body), function () {
            if (callback) {
                callback();
            }
        });
    };

    module.exports = logout;
}());