const path = require("path");
const net = require('net');
const fs = require('fs');
require('dotenv').config();
const port = 8124;
let floderName;
let seed = 0;
let dirPath;
let dir = process.env.DIR;
let countUser = process.env.FILES;
let conections = 0;
//DIR=default FILES=2 nodemon server.js
const server = net.createServer((client) => {
    if(conections <= countUser){
    const logger = fs.createWriteStream('client_'+ seed +'.txt');
    logger.write('Client ' + seed + ' disconnected\n');
    client.id = seed;
    conections++;
    dirPath = "client_" + seed;
    client.setEncoding('utf8');

    client.on('data', (data) => {
        if (data === 'REMOTE') {
            client.write('ACK');
            console.log("New user with files and ID: " + seed++);
        }
        else{
            fs.mkdir(dirPath, function(err) {
                arr = data.split(' ');
                arrs = data.split('!');
                    if(arr.length == 1){
                        fs.writeFile(dirPath +'/'+ dir +".txt", "Default text!", function(err) {
                            if(err) throw err; 
                        });
                    }
                        for (var i = 0; i < arr.length; i++) {
                            let extname = path.extname(arr[i]);
                    if(extname == ".txt"){
                        console.log(arr[i]);
                    fs.writeFile(dirPath +'/'+ arr[i], arrs[i], function(err) {
                        if(err) throw err; 
                    });
                  }
                }
            });
        }
    });

    client.on('end', () => console.log('Client disconnected'));
} else {
    client.write('DEC');
    console.log("Exceeded the allowable limit.");
}
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});