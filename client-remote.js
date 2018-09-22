const path = require('path');
const net = require('net');
const fs = require('fs');
const port = 8124;
const client = new net.Socket();
let command = process.argv[2]
let original = process.argv[3];
let copy = process.argv[4];
let key = process.argv[5];

client.setEncoding('utf8');
client.connect(port, function () {
    console.log('Connected');
    client.write('REMOTE');
});

client.on('data',  (data) => {
    if (data === 'DEC') {
        client.destroy();
    }
    if (data === 'ACK') {
    	console.log(process.argv.length);
    	if(process.argv.length == 5) 
    		client.write(command + ',' + original + ',' + copy);
    	else{
    		if (command == 'ENCODE')
    		client.write(command + ',' + original + ',' + copy + ',' + key);
    		if (command == 'DECODE')
    		client.write(command + ',' + original + ',' + copy + ',' + key);
    	 console.log("Erroe with write command.")
    	}
    }
    if (data === ''){}
});

client.on('close', function () {
    client.destroy();
    console.log('Connection closed');
});
