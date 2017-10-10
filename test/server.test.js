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
        openClient((err, client1) => {
            openClient((err, client2) => {
                client1.write('A/S/L???', ()=>{});
                client2.write('85/M/CA ;)', () => {
                    setTimeout(()=>{
                        fs.readFile(logFile, 'utf8', (err, data)=>{

                            let readArray = data.split('\n');
                            readArray = readArray.map(line => {
                                return {
                                    date: line.split(' ** ')[0],
                                    message: line.split(' ** ')[1]
                                };
                            });
                            readArray.pop();
                            const allDates = readArray.map(a => a.date);
                            const allMessages = readArray.map(a => a.message);
                            
                            const messageArray = ['A/S/L???','85/M/CA ;)'];

                            assert.deepEqual(allMessages, messageArray);

                            allDates.forEach(date =>{
                                const d = new Date(date);
                                assert.ok(!isNaN(d.getTime()));
                            });
                            done();

                        }, 500);
                        
                    });
                });
            });
        });
    });
});