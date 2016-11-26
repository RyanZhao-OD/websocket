const express = require('express');
let app = express();

//当客户端向服务器发送/请求的时候
app.get('/', function(request, response) {
    //发送文件到客户端
    //当发送一个HTML文件的时候，如果用相对路径，那么要指定绝对目录。也可以指定绝对路径
    response.sendFile('./index.html', {
        root: __dirname
    });
});

//创建一个http的服务器
let server = require('http').createServer(app);
//通过传入http服务器的实例，得到io服务的实例
let io = require('socket.io')(server);

//监听客户端的连接，当客户端连接到来的时候执行回调函数
//注意：会为每个客户端单独执行回调函数并且为每个客户端创建一个单独的socket对象
io.on('connection', function(socket){
    //监听对方也就是客户端发过来的消息
    socket.on('message', function(message) {
        console.log(message);
        //向对方也就是客户端发消息
        socket.send(message);
    });
});


//启动http服务器，
//注意： 现在websocket服务器和http服务共用了8080端口
server.listen(8080, function(){
    console.log('服务器启动完毕!');
});