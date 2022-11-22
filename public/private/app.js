let socket = io("/privateSpace");
let userColour;

let roomName = window.prompt("enter a room name - animals only");
console.log("ROOM : ", roomName);

socket.on("connect", ()=> {
  console.log("Connection established to server via sockets");
  if(roomName) {
    let roomData = {
    name : roomName 
    }
    socket.emit("roomJoin", roomData);
  } else {
    alert("refresh and ENTER A NAME!!!")
  }
  
})

//on getting info from server
socket.on("serverData", (data) => {
  drawPainting(data);
})

function setup() {
  colorMode(RGB);
  createCanvas(800,400);
  background("#000000");
  colorMode(HSB);
  userColour = random(0,360);
  // noStroke();
}

function mouseDragged() {
  // ellipse(mouseX, mouseY, 10);
  let mouseObj = {
    x : mouseX,
    y : mouseY,
    px : pmouseX,
    py : pmouseY,
    lineColour : userColour
  }
  socket.emit("mouseData", mouseObj);

}

function drawPainting(data) {
  strokeWeight(10)
  stroke(data.lineColour,50,50);
  line(data.x, data.y, data.px, data.py);
}


