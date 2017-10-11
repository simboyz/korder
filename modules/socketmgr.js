/*global module, require, console*/
/*jslint this:true, for:true*/

(function () {

    'use strict';

    var common = require('./common');
    var logWriter = require('./logWriter');

    var socketmgr = function (httpserver) {
        var io = require('socket.io')(httpserver);
        io.on('connection', function (clientsocket) {
            common.socketClient[clientsocket.id] = clientsocket;
            logWriter('CLIENT SOCKET CONNECTION', 'socket.id: ' + clientsocket.id);

            clientsocket.on('disconnect', function () {
                logWriter('CLIENT SOCKET DISCONNECTION', 'socket.id: ' + clientsocket.id);
                common.socketClient[clientsocket.id] = null;
                delete common.socketClient[clientsocket.id];
            });
        });
    };

    module.exports = socketmgr;

}());