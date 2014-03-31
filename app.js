var http = require('http');
var server = http.createServer();

server.on('request', function(req,res){
	res.writeHead(200, {'Content-type': 'text/plain'});
	res.end('Server is running...');
});

server.listen(8080, function(){
	console.log('Escuchando en http://localhost:8080');
});

var players = [];

var socketio = require('socket.io');
socketio.listen(server).on('connection', function(socket){
	socket.on('join', function(newPlayer){
		for(var i=0,len=players.length;i<len;i++){
			socket.emit('playerjoined', leanify(players[i]));
		}

		players.contains(newPlayer, function(found){
			if(!found){
				players.push(leanify(newPlayer));
				socket.broadcast.emit('playerjoined', leanify(newPlayer));
			}
		});
	});

	socket.on('quit', function(player){
		for(p in players){
			if(players[p].id === player.id){
				players.splice(p);
				socket.broadcast.emit('playerquit', leanify(player));
			}
		}
	});

	socket.on('move', function(player){
		socket.broadcast.emit('playermoved', leanify(player));
	});

	socket.on('speak', function(player){
		socket.broadcast.emit('playersaid', leanify(player));
	});
})

Array.prototype.contains = function(k, callback){
	var self = this;
	return(function check(i){
		if(i >= self.lenght){
			return callback(false);
		}

		if(self[i].id === k.id){
			return callback(true);
		}
		return process.nextTick(check.bind(null, i+1));
	}(0));
}


function leanify(p){
	var leanPlayer = {id: p.id};

	if(p.x){
		leanPlayer.x = p.x;
	}

	if(p.y) {
		leanPlayer.y = p.y;
	}

	if(p.direction){
		leanPlayer.direction = p.direction;
	}

	if(p.image){
		leanPlayer.image = p.image;
	}

	if(p.caption){
		leanPlayer.caption = p.caption;
	}

	return leanPlayer;
}




