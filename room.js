var ball = require("./ball");

var MAX_PLAYERS = 2;
var allRooms = [];

// Represents slots in game (stores location and status)
function s1(){
    return {
        x: 100,
        y: 250,
        occupied: false
    }
}

function s2(){
    return {
        x: 400,
        y: 250,
        occupied: false
    }
}

// Room constructor
var room = function(){
    this.playing = false;
    this.slot1 = new s1();
    this.slot2 = new s2();

    this.name = allRooms.length;
    this.ball = new ball(this);
    this.allPlayers = [];
    allRooms.push(this);

};

// Changes playing status based on if the both slots are full
room.prototype.startGame = function(){

    if(this.slot1.occupied && this.slot2.occupied){

        console.log("starting game in 5 seconds!");
        setTimeout(function(){
            this.playing = true;
            this.slot1.player.info.points = 0;
            this.slot2.player.info.points = 0;
        }.bind(this), 5000);
        return true;
    }
    this.playing = false;
    return false;

};

/* Looks for a room for the player to join. If there are no rooms or if all
 * rooms are full, it creates one and returns it. If there
 * are multiple rooms, it looks for an empty slot and returns that room.
 */
function findRoom(player){

    if(allRooms.length <= 0){
        var r = new room();
        r.allPlayers.push(player);
        player.currentRoom = r;
        player.roomIndex = r.allPlayers.length - 1;
        player.info.roomName = r.name;
        player.socket.join(r.name);

        player.info.x = r.slot1.x;
        player.info.y = r.slot1.y;
        player.currentSlot = r.slot1;
        r.slot1.player = player;
        r.slot1.occupied = true;

        return r;
    }

    for(var i = 0; i < allRooms.length; i++) {
        if (allRooms[i].allPlayers.length < MAX_PLAYERS) {
            allRooms[i].allPlayers.push(player);
            player.currentRoom = allRooms[i];
            player.roomIndex = allRooms[i].allPlayers.length - 1;
            player.info.roomName = allRooms[i].name;
            player.socket.join(allRooms[i].name);

            if(allRooms[i].slot1.occupied == false){
                player.info.x = allRooms[i].slot1.x;
                player.info.y = allRooms[i].slot1.y;
                player.currentSlot = allRooms[i].slot1;
                allRooms[i].slot1.player = player;
                allRooms[i].slot1.occupied = true;
            } else {
                player.info.x = allRooms[i].slot2.x;
                player.info.y = allRooms[i].slot2.y;
                player.currentSlot = allRooms[i].slot2;
                allRooms[i].slot2.player = player;
                allRooms[i].slot2.occupied = true;
            }

            allRooms[i].startGame();

            return allRooms[i];
        }
    }

    var r = new room();
    r.allPlayers.push(player);
    player.currentRoom = r;
    player.roomIndex = r.allPlayers.length - 1;
    player.info.roomName = r.name;
    player.socket.join(r.name);

    player.info.x = r.slot1.x;
    player.info.y = r.slot1.y;
    player.currentSlot = r.slot1;
    r.slot1.player = player;
    r.slot1.occupied = true;

    return r;
}

// Adds player to room provided and returns a status
function joinRoom(p, r){
    if(r.allPlayers.length < room.MAX_PLAYERS){
        r.allPlayers.push(p);
        p.currentRoom = r;
        console.log(p.name + " joined" + r.name);
        p.roomIndex = r.allPlayers.length - 1;
        p.info.roomName = r.name;
        p.socket.join(r.name);
        return true;
    }

    return false;
}


module.exports = room;
module.exports.allRooms = allRooms;
module.exports.findRoom = findRoom;
module.exports.joinRoom = joinRoom;