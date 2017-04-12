
var express = require('express');
var favicon = require('express-favicon');
var app = express();
var server = require('http').Server(app);  
var io = require('socket.io')(server);
console.log('log1');

//Express
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(favicon(__dirname + '/public/favicon.png'));

console.log('log2');


var filename = __dirname + "/log.txt";

// -- Node.js Server ----------------------------------------------------------
app.get('/', function(req, res) { 
    console.log('about to serve /index.html')
 
    res.sendFile(__dirname + '/index.html');
});

app.get('/test', function(req, res) {  
    console.log('about to serve /test.html');
    res.sendFile(__dirname + '/test.html');
});

app.get('/omniture',function (req, res) {
  var fs = require('fs');
  for (var propName in req.query) {
    if (req.query.hasOwnProperty(propName)) {
        console.log(propName, req.query[propName]);
        fs.appendFileSync(filename, propName + "=" + req.query[propName] + "\n" );
    }
  }
  fs.appendFileSync(filename, "-------------------------------------------" + "\n" );
  res.send('OK');
});

server.listen(8081, function () {
  console.log('Example app listening on port 8081!');
})

// -- Setup Socket.IO ---------------------------------------------------------

io.on('connection', function(socket){
  console.log('Client connected');
  console.log(filename);
  socket.emit('announcements', { message: 'A new user has joined!' });
  ft = require('file-tail').startTailing(filename);
 
  ft.on('line', function(line) {
      socket.send( { value : line.toString('utf-8') } )
  });
});
