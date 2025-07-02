const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

let activeRooms = {};

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

app.post("/create-room", (req, res) => {
  const code = generateRoomCode();
  activeRooms[code] = {
    host:req.body.name,
    players: []
  };
  res.json({ roomCode: code });
});


io.on("connection", (socket) => {
  socket.on("start-game", (roomCode) => {
    io.to(roomCode).emit("game-started", roomCode);
  });
  socket.on("join-room", ({ name, roomCode }) => {
  const room = activeRooms[roomCode];
  if (room) {
    if (room.players.includes(name)) {
      socket.emit("error-msg-join", "This player is already added.");
    } else {
      socket.join(roomCode);
      room.players.push(name);
      io.to(roomCode).emit("room-players", {
        players: room.players,
        host: room.host
      });
    }
  } else {
    socket.emit("error-msg-join", "Room does not exist.");
  }
  });

});

server.listen(3001, () => console.log("🚀 Backend running on http://localhost:3001"));
