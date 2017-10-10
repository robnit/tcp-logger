const assert = require('assert');
const createLogServer = require('../lib/create-log-server');
const net = require('net');
const fs = require('fs');
const path = require('path');

describe('chat app server', () => {
    const port = 15688;
    const logFile = path.join(__dirname, 'log.txt');
    
    beforeEach(done => {
        fs.unlink(logFile, err => {
            if(err && err.code !== 'ENOENT') done(err);
            done();
        });
    });
    
    let clients = null;
    let server = null;
    beforeEach(done => {
        console.log('in before hook, logFile is', logFile);
        clients = [];
        server = createLogServer(logFile);
        server.listen(port, done);
    });
    
    afterEach(() => {
        clients.forEach(client => client.destroy());
        server.close();
    });

    function openClient(callback) {
        let client = net.connect(port, () => {
            client.setEncoding('utf8');
            clients.push(client);
            callback(null, client);
        });
    }

    it('receives message from client and writes to log file', done => {
        console.log('=============');
        openClient((err, client1) => {
            openClient((err, client2) => {
                // do client.write calls
                // on last client.write call, you need to use the
                // write callback to *wait" for the socket to finish before you test the log file
                client1.write('A/S/L???', ()=>{});
                client2.write('85/M/CA ;)', () => {
                    setTimeout(()=>{
                        fs.readFile(logFile, 'utf8', (err, data)=>{
                            console.log('data is ', data);
                            console.log('data typeof is', typeof data);
                            assert.equal('data', 'string');
                            done();
                        }, 500);
                        
                    });
                });
                // read log file and test here!

                // done();
            });
            
        });
    });
});