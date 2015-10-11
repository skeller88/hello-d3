var http = require('http');
var static = require('node-static');

var port = 3000;
var ip = '127.0.0.1';
var headers = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10, // Seconds.
    "content-type": "application/json"
};

var fileServer = new static.Server('./public');

var server = http.createServer(function(req, res) {
    console.log(req.url);
    req.addListener('end', function() {
        fileServer.serve(req, res);
    }).resume();
});

server.listen(port, ip);

console.log('Server listening on port', port);