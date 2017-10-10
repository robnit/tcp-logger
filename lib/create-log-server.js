const net = require('net');
const fs = require('fs');


function createLogServer(logFile) {
    const stream = fs.createWriteStream(`${logFile}`, {'flags': 'a'});

    const server = net.createServer(client => {
        client.setEncoding('utf8');
        client.on('data', message => {
            const parsedMessage = String(`${Date()} ** ${message}\n`);
            stream.write(parsedMessage);
        });
    });
    return server;   
}

module.exports =  createLogServer;