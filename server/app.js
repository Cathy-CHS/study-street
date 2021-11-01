/**
 * app.js
 * 
 * @ Reference
 *  Socket Room : https://socket.io/docs/v3/rooms/
 */
const express = require("express");
const http = require("http");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);
const origin = "http://localhost:3000"


let { userList, groupList } = require("./database");

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

let interval;

const SocketIOServer = require("./socketIOServer.js");
const socketIOServer = SocketIOServer()
socketIOServer.init(server, origin)

server.listen(port, () => console.log(`Listening on port ${port}`));