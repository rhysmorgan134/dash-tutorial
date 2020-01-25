var can = require('socketcan');

var channel = can.createRawChannel('vcan0', true);

var speed = 0
var revs = 0
var up = true
var msg = {
    'id': 500,
    data: [0,0,0,0,0,0,0,0]
}

channel.addListener("onMessage", function(msg) {
    if(msg.id === 501) {
        var dataArr = [...msg.data]
        if(dataArr[0] === 255) {
            revs = 0
            speed = 0
        }
    }
})

setInterval(() => {
    var out = {}
    var buff = Buffer.alloc(8)
        if(speed < 155) {
        speed = speed + 1;
        revs = revs + 240
        if(revs > 7000) {
            revs = 1000
        }
        } else {
            if(up) {
                revs = revs -100
                up = false
            } else {
                revs = revs + 100
                up = true
            }
        }
    buff.writeUIntBE(revs, 0, 4)
    buff.writeUIntBE(speed, 4, 2)
    console.log(revs, speed)
    out.id = msg.id
    out.data = buff
    console.log(channel.send(out))    
}, 100)

channel.start()