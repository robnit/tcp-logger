const assert = require('assert');
const net = require('net');
const fs = require('fs');
const path = require('path');

const createLogServer = require('../lib/create-log-server');

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

                            let messageArray = data.split('\n');
                            //Remove empty element at end of array
                            messageArray.pop();

                            messageArray = messageArray.map(line => {
                                return {
                                    date: line.split(' ** ')[0],
                                    message: line.split(' ** ')[1]
                                };
                            });

                            const allDates = messageArray.map(a => a.date);
                            messageArray = messageArray.map(a => a.message);
                            
                            const expectedMessages = ['A/S/L???','85/M/CA ;)'];

                            assert.deepEqual(messageArray, expectedMessages);

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