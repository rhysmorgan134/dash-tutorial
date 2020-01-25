var express = require("express");
var app = express()
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var can = require('socketcan');

var channel = can.createRawChannel('vcan0', true);

var carInfo = {};
carInfo.speed = 0;
carInfo.revs = 0;

channel.addListener("onMessage", function(msg) {
    if(msg.id === 500) {
        carInfo.revs = msg.data.readUIntBE(0, 4)
        carInfo.speed = msg.data.readUIntBE(4, 2)
    }
})

app.use(express.static(__dirname + '/html'))
app.use('/scripts', express.static(__dirname + '/node_modules/canvas-gauges/'));

//on socket connection
io.on('connection', function(client) {
    
    //on client action over socket
    client.on('action', (data) => {
        console.log(data)
        if(data.reset === true) {
            msg = {}
            msg.id = 501
            msg.data = new Buffer([255, 0, 0, 0, 0, 0, 0, 0])
            console.log(channel.send(msg))
        }
    })
    console.log('Client connected....');

})

setInterval(function() {
    io.emit('engine', carInfo)

},100)

channel.start()

server.listen(3000)
