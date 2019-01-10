var spawn = require('child_process').spawn;
var task;

function start() {
    task = spawn('node', ['index.js']);
    function restart(code, signal) {
        task.kill(signal);
        setTimeout(start, 1000);
    }
    function stdxxx(data) {
        console.log('' + data);
    }
    task.stdout.on('data', stdxxx);
    task.stderr.on('data', stdxxx);
    task.on('close', restart);
}

start();
