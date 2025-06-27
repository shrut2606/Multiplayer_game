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

app.get("/create-room", (req, res) => {
  const code = generateRoomCode();
  activeRooms[code] = {
    players: []
  };
  res.json({ roomCode: code });
});

io.on("connection", (socket) => {
  socket.on("join-room", ({ name, roomCode }) => {
  const room = activeRooms[roomCode];
  if (room) {
    if (room.players.includes(name)) {
      socket.emit("error-msg", "This player is already added.");
    } else {
      socket.join(roomCode);
      room.players.push(name);
      io.to(roomCode).emit("room-players", room.players);
    }
  } else {
    socket.emit("error-msg", "Room does not exist.");
  }
});

});

server.listen(3001, () => console.log("🚀 Backend running on http://localhost:3001"));
