const { Worker } = require('worker_threads');
const path = require('path');

let N = process.argv[2];

for (var i = 1; i <= N; i++) {
  const w = new Worker(path.join(__dirname, 'client-files.js'));
}