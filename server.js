var express = require('express');
var	path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

const numPort = 3000;

var indexRoute = require('./app/routes/');
var apiV1Route = require('./app/routes/v1');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server); 

//BodyParser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//DB Connect
var db = "mongodb://aminhas:password@ds117919.mlab.com:17919/tracklist";
mongoose.connect(db, function(err) {
	if(err) {
		console.log(err);
		return;
	}
	console.log("Connected to db ", db);
});

//View Engine
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'/app/client')));

//Routes
app.use('/',indexRoute);
app.use('/v1',apiV1Route);

server.listen(numPort, function() {
	console.log("Running server at port " + numPort);
});

//Socket.io
var connections = [];
io.sockets.on('connection', function(socket) {
	connections.push(socket);
	// console.log('Connected: %s sockets connected.', connections.length);

	// Disconnect
	socket.on('disconnect', function(data) {
		connections.splice(connections.indexOf(socket),1);
		// console.log('Disconnected: %s sockets connected.', connections.length);
	}) ;

	// Add Track
	socket.on('addTrack', function(data) {
		console.log("SOCKET :On Add Track Event",data);
		io.sockets.emit('newTrack', {oTrack : data});
	});

	// Delete Track
	socket.on('cDeleteTrack', function(data) {
		console.log("SOCKET :On Delete Track Event",data);
		io.sockets.emit('sDeleteTrack', {strTrackId : data});
	});
	
	// Edit Track
	socket.on('cEditTrack', function(data) {
		console.log("SOCKET : cEditTrack",data);
		io.sockets.emit('sTrackEdited', {oTrack : data});
	});

	// Add Genre
	socket.on('addGenre', function(data) {
		console.log("SOCKET :On Add Genre Event",data);
		io.sockets.emit('newGenre', {oGenre : data});
	});

	// Delete Genre
	socket.on('cDeleteGenre', function(data) {
		console.log("SOCKET :On Delete Genre Event",data);
		io.sockets.emit('sDeleteGenre', {strGenreId : data});
	});

	// Edit Genre
	socket.on('cEditGenre', function(data) {
		console.log("SOCKET : cEditGenre",data);
		io.sockets.emit('sGenreEdited', {oGenre : data});
	});

}) 