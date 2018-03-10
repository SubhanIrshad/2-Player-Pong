var canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 600;

// Initialize the context
var ctx = canvas.getContext("2d");

ctx.fillStyle = "black";
ctx.font="18px Arial";
ctx.textAlign="center";

var playing = false;
var filled = false;
var countdownPopup = false;
var countdown = 0;

var socket = io.connect();

// Sends and prompts client for name
socket.emit("login", prompt("Enter your name"));

socket.on("filled", function(data){
    if(data.filled) {
        filled = data.filled;
    } else {
        filled = data.filled;
        playing = false;
    }
    console.log(filled);
    countdownPopup = data.filled;
    countdown = data.time;
    var count = setInterval(function(){
        countdown -= 1;

        if(countdown <= 0){
            countdownPopup = false;
            clearInterval(count);
        }
    },1000);
});

socket.on("start", function(){
    playing = true;
});

// Draws game based on information passed (an array)
socket.on("message", function(data){
    ctx.clearRect(0, 0, 500, 600);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draws border and text
    ctx.strokeStyle = "white";
    ctx.strokeWidth = 10;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(500, 0);
    ctx.lineTo(500, 500);
    ctx.lineTo(0, 500);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.fillText("use the arrow keys to move up or down!", 250, 550);

    if(!filled){
        ctx.fillStyle = "white";
        ctx.fillText("Waiting for another player...", 250, 220);
    }

    // Draws and displays time remaining before game starts on canvas
    if(countdownPopup && !playing && filled){
        ctx.fillStyle = "white";
        ctx.fillText("Game Start in: " + countdown, 250, 220);
    }

    // Loops through the array passed (draws players)
    var info = data;
    info.forEach(function(e){
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.fillRect(e.x - e.width/2, e.y - e.height/2, e.width, e.height);
        if(e.points != undefined) {
            ctx.fillText(e.name + ": " + e.points, e.x, 500 + 20);
        }
        ctx.closePath();
        ctx.stroke();
        console.log(e.roomName);
    });

});

// An Object that contains the keys the client is pressing
var keys = {
    "up":false,
    "down": false
};

// Adds an event listener to catch key presses
window.addEventListener("keydown", function(e){

    if(e.keyCode == 38){
         keys.up = true;
     }
     if(e.keyCode == 40){
         keys.down = true;
     }

     // Sends the keys pressed
    socket.emit("update", keys);
});

// Adds an event listener to catch key releases
window.addEventListener("keyup", function(e){

    if(e.keyCode == 38){
        keys.up = false;
    }
    if(e.keyCode == 40){
        keys.down = false;
    }
    if(e.keyCode == 37){
        keys.left = false;
    }
    if(e.keyCode == 39){
        keys.right = false;
    }

    // Sends the keys pressed
    socket.emit("update", keys);
});
