const express = require('express');

let app = express();


app.get('/clock', function(request, response){
    response.setHeader('Access-Control-Allow-Origin', '*'); // 允许跨域
    response.send(new Date().toLocaleString());
});

app.listen(8080);