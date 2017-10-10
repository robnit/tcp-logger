const net = require('net');
const fs = require('fs');


function createLogServer(logFile) {
    const stream = fs.createWriteStream(logFile, {'flags': 'a'});

    const app = net.createServer(client => {
        //listener stuff
        client.setEncoding('utf8');
        client.on('data', message => {});
    });
    
}

module.exports =  createLogServer();