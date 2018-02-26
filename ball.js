// Ball constructor
var ball = function(room){

    this.currentRoom = room;
    this.defaultSpeed = 10;
    this.speed = 10;
    this.speedMod = 5;

    var angle = Math.random() * (Math.PI * 2);
    this.dy = Math.sin(angle) * this.speed;
    this.dx = Math.cos(angle) * this.speed;

    this.info = {
        name: "",
        x:250,
        y:250,
        width: 10,
        height:10,
    }
};

// Updates the location of the ball
ball.prototype.update = function(){
    this.info.x += this.dx;
    this.info.y += this.dy;

    // Respawns and awards points if ball bounces into either side
    if(this.info.x < 0){
        this.currentRoom.slot2.player.info.points++;
        this.respawn();
    }

    if(this.info.x > 500){
        this.currentRoom.slot1.player.info.points++;
        this.respawn();
    }

    // Reverse the vertical velocity if collision with wall
    if(this.info.y < 0){
        this.info.y = 0;
        this.dy *= -1;
    }
    if(this.info.y > 500){
        this.info.y = 500;
        this.dy *= -1;
    }

};

// Resets the location, velocity, and direction of the ball
ball.prototype.respawn = function(){
    this.info.x = 250;
    this.info.y = 250;

    this.speed = this.defaultSpeed;
    var angle = Math.random() * (Math.PI * 2);
    this.dy = Math.sin(angle) * this.speed;
    this.dx = Math.cos(angle) * this.speed;
    this.speed = 10;
};

// Checks for collision with the object passed
ball.prototype.collision = function(obj){
    var x = this.info.x;
    var y = this.info.y;
    var width = this.info.width;
    var height = this.info.height;

    if(x - width/2 < obj.info.x + obj.info.width/2 &&
        x + width/2 > obj.info.x - obj.info.width/2 &&
        y - height/2 < obj.info.y + obj.info.height/2 &&
        height/2 + y > obj.info.y - obj.info.height/2){
            return true;
    } else {
        return false;
    }
};

module.exports = ball;