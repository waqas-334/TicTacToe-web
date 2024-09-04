const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const { makeMove } = require("./game-logic");

const app = express();
const server = createServer(app);

const io = new Server(server);
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

let players = {
  /**
   * roomID : {
   *      playerId: playerSymbol,
   *      playerId: playerSymbol
   * }
   */
};
io.on("connection", (socket) => {
  const playerID = socket.id;
  console.log("a user connected ", playerID);

  socket.on("joinRoom", (roomId) => {
    const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
    // let symbol = "-";
    // if (roomSize == 0) {
    //   symbol = "X";
    // } else symbol = "O";
    // if (roomSize > 1) {
    //   socket.emit("error", "ROOM FULL");
    // } else {
    socket.join(roomId);

    insertData(roomSize, playerID);
    let symbol = players[playerID];

    io.to(roomId).emit("roomJoined", {
      playerId: playerID,
      //   roomSize: roomSize + 1,
      roomId: roomId,
      symbol: symbol,
    });
    console.log("User joined Room ", roomId);
    // }
  });

  socket.on("getRoomSize", (room) => {
    const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;
    socket.emit("roomSize", roomSize);
  });

  socket.on("move", (payload) => {
    console.log("DATA ", payload);
    makeMove(payload.position, payload.playerSymbol);
    io.to(payload.room).emit("move", payload);
  });
});

function insertData(connectionSize, playerID) {
  if (connectionSize == 0) {
    //means first connection
    players[playerID] = "X";
    // players.push({ id: playerID, symbol: "X" });
  } else {
    players[playerID] = "Y";
    // players.push({ id: playerID, symbol: "Y" });
  }
  //TODO clear the values when connection is gone
  console.log("PLAYERS: ", players);
}
