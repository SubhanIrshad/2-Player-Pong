// Player constructor
var player = function(socket){

    this.socket = socket;
    this.currentRoom = "";
    this.roomIndex;

    this.currentSlot = {
        points:0,
        x: 250,
        y: 250,
        occupied: true,
    };

    this.friction = 0.9;
    this.speed = 5;

    this.up = false;
    this.down = false;

    this.dx = 0;
    this.dy = 0;

    // Packet of info that will be sent to client
    this.info = {
        name: "DEFAULT",
        roomName: "",
        x: 250,
        y: 250,
        width: 50,
        height:100,
        points: this.currentSlot.points,
    };
};

// Updates the current keys pressed based on keys sent by client
player.prototype.updateKeys = function(input){
    var keys = input;
    this.up = keys.up;
    this.down = keys.down;
};

// Updates the player's location based on keys pressed
player.prototype.update = function(){
    if(this.up){
        this.dy -= this.speed;
    }
    if(this.down){
        this.dy += this.speed;
    }

    this.dx *= this.friction;
    this.dy *= this.friction;

    this.info.x += this.dx;
    this.info.y += this.dy;

    if(this.info.y > 500 - this.info.height/2){
        this.info.y = 500 - this.info.height/2;
        this.dy = 0;
    }

    if(this.info.y < 0 + this.info.height/2){
        this.info.y = 0 + this.info.height/2;
        this.dy = 0;
    }

};

module.exports = player;