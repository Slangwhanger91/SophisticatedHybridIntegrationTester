const express = require('express');
const http = require('http');
const app = express();
const port = 3000;
//#!/usr/bin/env node

/**
 * Module dependencies.
 */
var appAccess = require('./endpoints/app-access');
var debugMocks = require('./endpoints/debug-mocks');
var networka = require('./endpoints/network-a');
var eventHandler = require('./endpoints/event-handler');

/**
 * Get port from environment and store in Express.
 */
app.set('port', port);
app.use("/users", appAccess);
app.use("/mocks", debugMocks);
app.use("/network", networka);
app.use("/events", eventHandler);
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
;
