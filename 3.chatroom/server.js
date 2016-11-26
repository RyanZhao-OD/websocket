var express = require('express');
var app = express();
app.use(express.static(__dirname));
//当客户端向服务器发送/请求的时候
app.get('/',function(req,res){
    //发送文件到客户端
    //当发送一个HTML文件的时候，如果用相对路径，那么要指定绝对目录。也可以指定绝对路径
    res.sendFile('./index.html',{root:__dirname});
});
//创建一个http的服务器
var server = require('http').createServer(app);
//通过传入http服务器的实例，得到io服务的实例
var io = require('socket.io')(server);
//监听客户端的连接，当客户端连接到来的时候执行回调函数
//注意：会为每个客户端单独执行回调函数并且为每个客户端创建一个单独的socket对象
var users = {};//记录每个人用户名和socket的对应关系
var messages = [];// 存放着所有的历史消息
io.on('connection',function(socket){
    //当前socket的用户名，应该作为当前函数运行时产生的私有作用域中的私有变量，这要才不会冲突
    var username;
    var roomName;//当前用户所有的房间名
    //当服务器监听到客户端希望获取所有的历史 消息的时候，
    socket.on('getAllMessages',function(){
        //向客户端 发送allMessages事件，并发送所有的历史消息数组
        socket.emit('allMessages',messages);
        socket.send({author:'系统',content:'请问你的用户名是什么?',createAt:new Date()});
    });
    socket.on('join',function(room){
        roomName = room;
        socket.join(room);
    });
    //监听对方也就是客户端发过来的消息
    socket.on('message',function(message){
        //如果username有值表示用户名已经设置过了，表示普通的发言
        if(username){
            //先判断是否是私聊  @xx yy                 xxxx
            var regex = new RegExp('@(\\w+) (.+)');
            var result = message.match(regex);
            if(result){//如果result有值表示匹配成功，则意味着这是私聊
                var toUser = result[1];//取得私聊对方的用户名
                var content = result[2];//取得想说的话
                users[toUser]&&users[toUser].send({author:'[私聊]'+username,content:content,createAt:new Date()});
                socket.send({author:'[私聊]我对'+toUser+'说',content:content,createAt:new Date()});
            }else{
                var msg = {author:username,content:message,createAt:new Date()};
                messages.push(msg);
                if(roomName){
                    io.in(roomName).emit('message',msg);
                }else
                    io.emit('message',msg);
            }
        }else{//如果没有值表示用户名没有设置过,此MESSAGE就是用户名了
            username = message;
            //设置完用户名后，把此用户名和对应的socket保存在users对象内部
            users[username] = socket;
            io.emit('message',{author:'系统',content:`欢迎<span class="user">${username}</span>加入聊天室`,createAt:new Date()});
        }
        //向对方也就是客户端发消息
        //socket.send(message);
        //向所有连接到此服务器的客户端发送消息
    });
});
//启动http服务器，
//注意： 现在websocket服务器和http服务共用了8080端口
server.listen(8080,function(){
    console.log('服务器启动完毕!');
});
/*function send(){
 var args = Array.prototype.slice.call(arguments);// [message]
 args.unshift('message');//['message',message]
 this.emit.apply(this, args);
 //socket.emit('message',message);
 return this;
 };*/
/**
 * 一、实现聊天功能
 * 1. 给按钮帮定click监听函数
 * 2. 当按钮被点击的时候执行监听函数，获取发言的内容，然后通过socket.send发送给服务器。
 * 3. 服务端把此消息广播(io.emit)给所有的客户端
 * 4. 所有的客户端收到此消息后，会把此消息转成li追加到ul的内部
 */
/**
 * 1. 当客户端连接上来的时候，先询问用户名
 * 2. 客户端向后台发送用户名
 * 3. 服务器把此用户名张三和此socket关联保存起来
 * 4. 以后通过此socket过来的发言就是张三的发言了
 * 5.
 */
/**
 *  三、实现私聊
 *  1. 让用户名变成可点击的蓝色
 *  2. 当点击用户名的时候，会拼出 @用户 ，追加到输入框中
 *  3. 在输入框中输入想说的话
 *  4. 点击发送按钮或回车将输入框中的内容发送到后台
 *  5. 在服务器找到要私聊的用户socket.并定向地向他发消息
 **/
/**
 * 1. 我给别人私聊，我看不见消息
 * 2. 刷新页面之后消息全部没有，看不到历史消息
 **/