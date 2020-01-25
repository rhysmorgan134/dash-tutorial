var socket = io.connect('192.168.0.85:3000')

document.addEventListener("DOMContentLoaded", onDomReadyHandler);

var reset = function() {
    data = {reset:true}
    socket.emit('action', data)
}


function onDomReadyHandler(event) {
    socket.on('engine', (data) => {
        var speedo = document.getElementsByTagName('canvas')[0];
        var revCounter = document.getElementsByTagName('canvas')[1];
        console.log(data)
        speedo.setAttribute("data-value", data.speed)
        revCounter.setAttribute("data-value", data.revs)
})
}
