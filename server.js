const crypto = require('crypto');
const path = require("path");
const net = require('net');
const fs = require('fs');
const port = 8124;
let fileName;
let seed = 0;
let arr = [];

const server = net.createServer((client) => {
    const logger = fs.createWriteStream('client_'+ seed +'.txt');
    logger.write('Client ' + seed + ' disconnected\n');
    client.id = seed;
    client.setEncoding('utf8');

    client.on('data', (data) => {
        if (data === 'REMOTE') {
            client.write('ACK');
            console.log("New user with files and ID: " + seed);
        }
        else{
        	arr = data.split(',');

        	if(arr[0] === "COPY"){
        		fileName = path.basename(arr[1]);
        		var readableStream = fs.createReadStream(arr[1], "utf8");
        		var writeableStream = fs.createWriteStream(arr[2] + "/" + fileName);
        			readableStream.on("data", function(chunk){ 
    					writeableStream.write(chunk);
    					writeableStream.end();
					});
				client.write('DEC');
        	}
        	if(arr[0] === "ENCODE"){
        		fileName = path.basename(arr[1]);
        		var readableStream = fs.createReadStream(arr[1], "utf8");
        		var writeableStream = fs.createWriteStream(arr[2] + "/cripto" + fileName);
        			readableStream.on("data", function(chunk){
        				var cryptoText = crypto.createCipher('aes-256-ctr', arr[3]).update(chunk, 'utf8', 'hex');
    					writeableStream.write(cryptoText);
    					writeableStream.end();
					});
				client.write('DEC');
        	}
        	if(arr[0] === "DECODE"){
        		fileName = path.basename(arr[1]);
        		var readableStream = fs.createReadStream(arr[1], "utf8");
        		var writeableStream = fs.createWriteStream(arr[2] + "/decipher" + fileName);
        			readableStream.on("data", function(chunk){
        				var decipher = crypto.createDecipher('aes-256-ctr', arr[3])
        				.update(chunk,'hex','utf8');
    					writeableStream.write(decipher);
    					writeableStream.end();
					});
				client.write('DEC');
        	}
   		}
    });

    client.on('end', () => console.log('Client with id: '+ seed++ +' disconnected'));
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});