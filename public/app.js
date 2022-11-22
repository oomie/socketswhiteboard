let socket = io("/publicSpace");
let userColour;

socket.on("connect", ()=> {
  console.log("Connection established to server via sockets");
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

