const WebSocketServer = require('ws').Server;

let wsServer = new WebSocketServer({port: 8080});  // websocket可以和http服务器共享相同端口，因为协议不一样


// Node里只要有on()方法 就是继承了 Emitter
// socket代表与客户端的连接对象 可以收消息 也可以发消息
wsServer.on('connection', function(socket){
    // 监听客户端发过来的消息 接收消息的时候会调用回调函数并把接收到的消息作为参数传进去
    socket.on('message', function(message){
        console.log('111');
        console.log(message);
        socket.send('server:' + new Date().toLocaleString());
    });

    socket.on('message', function(message){
        console.log('222');
        console.log(message);
        socket.send('server:' + new Date().toLocaleString());
    });
});