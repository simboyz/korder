/*global require, console, module*/
/*jslint this:true, for:true*/
(function () {

    'use strict';

    var fs = require('fs');
    var moment = require('moment');

    var logStream = fs.createWriteStream('log.txt', {
        flags: 'a',
        defaultEncoding: 'utf8',
        autoClose: true
    });

    var logWriter = function (prefix, data) {
        var result = '';
        if (prefix) {
            result = '>> TOPIC: [' + prefix + '] ';
        }
        result += moment().format('YYYY.MM.DD HH:mm:ss') + '\n';
        if (typeof data === 'object') {
            result += JSON.stringify(data);
        } else {
            result += data;
        }
        if (data !== '') {
            result += '\n';
        }
        console.log(result);
        logStream.write(result);
    };

    module.exports = logWriter;
}());