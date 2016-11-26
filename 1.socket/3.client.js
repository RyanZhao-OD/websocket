const Socket = require('ws');  // 客户端socket

// 开始准备连接 异步
let socket = new Socket('ws://localhost:8080');

socket.on('open', function open() {
    socket.send('hello world!');
});

socket.on('message', function(data, flags) {
    console.log(data);
    console.log('message ', data);
});