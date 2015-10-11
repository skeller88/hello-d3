var express = require('express');
var http = require('http');
var serveStatic = require('serve-static');

var port = 3000;

var app = express();

app.set('port', process.env.PORT || port);
app.use(serveStatic(__dirname + '/public'));

http.createServer(app).listen(app.get('port'), function() {
    console.info('Server now listening on port ' + app.get('port'));
});