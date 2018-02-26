var express = require("express");
var socket = require("socket.io");
var room = require("./room");
var player = require("./player");
var  ball = require("./ball");

var app = express();
var io = new socket;

var online = false;

var server = app.listen(process.env.PORT || 3000,function() {
    console.log("listening");

});

server.close = function(){
    online = false;
    console.log("server is closed");
};

var io = socket(server);

// Listens for connection
io.on("connection", function(socket){

    online = true;

    // Create a player object that stores information like socket, x, y, etc
    var p = new player(socket);

    // Listens for login and adds player to a room
    p.socket.on("login", function(name){
        p.info.name = name;
        room.joinRoom(p, room.findRoom(p));
        console.log(name + " joined!");
    });

    // Updates keys for player based on keys sent from client
    p.socket.on("update", function(keys){
        p.updateKeys(keys);
    });

    /* Resets the game, slot occupied, and scores for both players on leaving.
     * It also removes the player from the room they were in.
     */
    p.socket.on("disconnect", function(){
        if(online) {
            p.currentSlot.occupied = false;
            p.currentRoom.allPlayers.splice(p.roomIndex, 1);
            p.currentRoom.playing = false;

            if(p.currentRoom.slot1.player != undefined) {
                p.currentRoom.slot1.player.info.points = 0;
            }

            if(p.currentRoom.slot2.player != undefined) {
                p.currentRoom.slot2.player.info.points = 0;
            }
            p.currentRoom.ball.respawn();
            console.log("client left");
        }
    });

});

/* The Game loop. This basically updates the players, the ball, and sends the
 * location and more of every object.
 */
setInterval(function(){
    for(var i = 0; i < room.allRooms.length; i++){
        var packet = [];
        room.allRooms[i].allPlayers.forEach(function(p){
            p.update();
            packet.push(p.info);

            if(room.allRooms[i].ball.collision(p)){
                while(room.allRooms[i].ball.collision(p)){

                    room.allRooms[i].ball.info.x += -room.allRooms[i].ball.dx;
                    room.allRooms[i].ball.info.y += -room.allRooms[i].ball.dy;
                }
                var angle = Math.atan2(room.allRooms[i].ball.info.y - p.info.y, room.allRooms[i].ball.info.x - p.info.x);

                room.allRooms[i].ball.speed += room.allRooms[i].ball.speedMod;
                room.allRooms[i].ball.dy = Math.sin(angle) * room.allRooms[i].ball.speed;
                room.allRooms[i].ball.dx = Math.cos(angle) * room.allRooms[i].ball.speed;
            }

        });

        if(room.allRooms[i].playing) {
            room.allRooms[i].ball.update();
        }
        packet.push(room.allRooms[i].ball.info);

        if(online) {
            io.in(room.allRooms[i].name).emit("message", packet);
        }
    }
}, 1000/10);

app.use(express.static("public"));