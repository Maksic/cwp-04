const net = require('net');
const fs = require('fs');
const path = require('path');
const port = 8124;
const client = new net.Socket();
let arg = 0;

client.setEncoding('utf8');
client.connect(port, function () {
    console.log('Connected');
    client.write('FILES');
});

client.on('data',  (data) => {
    if (data === 'DEC') {
        client.destroy();
    }
    if (data === 'ACK') {
        process.argv.forEach(function (val, index, array) {
            arg++;
            console.log(arg);
            console.log(process.argv.length);
         fs.stat(val, (err, stats) => {
            if (stats.isDirectory()){
                fs.readdir(val, function(err, files){
                   files.forEach(function(file){
                    let extname = path.extname(file);
                        if(extname == ".txt"){
                            fs.readFile(val +"/"+ file, "utf8", function(err, datas) {
                                console.log(path.basename(file));
                                console.log(datas);
                                client.write(path.basename(file) + " ");
                                client.write(datas + "  ");
                            });
                        }
                    })
                });
            }
        }); 
      });
    }
    if(process.argv.length == 2) client.destroy();
   // if(process.argv.length == arg) client.write('DEC');
});

client.on('close', function () {
    client.destroy();
    console.log('Connection closed');
});

function push(fileName){
    return client.write(fileName + "\n");;
}