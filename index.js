//initialising express app
let express = require("express");
let http = require("http");
//add sockets on top of the http server
let io = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

let app = express();
app.use("/", express.static("public"));
let server = http.createServer(app);

io = new io.Server(server, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true
  }
});

instrument(io, {
  auth: false
});

//creating an http server ON the express app
server.listen(3000, () => {
  console.log("listening on 3000");
})


//create variable for public namespace
let publicSockets = io.of("/publicSpace");

//logic for public namespace
publicSockets.on("connect", (socket) => {
  
  console.log("New Connection : ", socket.id);

  //when server gets data from C
  socket.on("mouseData", (data) => {
    //emitting info only to public namespace
    publicSockets.emit("serverData", data);
    privateSockets.emit("serverData", data);
  })

  //for when C disconnects
  socket.on("disconnect", () => {
    console.log("Socket Disconnected : ", socket.id)
  })

})




//create variable for private namespace
let privateSockets = io.of("/privateSpace");

//logic for private namespace
privateSockets.on("connect", (socket) => {
  
  console.log("New Connection : ", socket.id);

  //when C sends request to join a room
  socket.on("roomJoin", (data) => {
    socket.roomName = data.name;
    socket.join(socket.roomName);
  })
  
  //when server gets data from C
  socket.on("mouseData", (data) => {
    //emitting info only to public namespace
    privateSockets.to(socket.roomName).emit("serverData", data);
  })

  //for when C disconnects
  socket.on("disconnect", () => {
    console.log("Socket Disconnected : ", socket.id)
  })

})


/* information flow
 
(done) C- initiate connection to server
(done) S - recognise a C conneciton and acknowledge when c connects
(done) S - also tell me when C disconnects
(done) C- acknowledge when server has been established

on the whiteboard: 
(done) C - emit mousex, my ("mousedata") to server
(done) S - on getting mousedata , emits to all C serverdata
C - on getting server data, draw

*/