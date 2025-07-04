// backend/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let activeRooms = {};

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

async function sendRandomQuestion(roomCode) {
  const room = activeRooms[roomCode];
  if (!room) {
    console.error(`Room ${roomCode} not found`);
    return;
  }

  const category=room.category;
  
  try {
    const tableName = `${category}_questions`;
    const { rows } = await pool.query(
      `SELECT id, question_type, text, choices, correct_answer
       FROM ${tableName}
       ORDER BY RANDOM()
       LIMIT 1`
    );
    if (!rows[0]) {
      io.to(roomCode).emit("error-msg", "No question found for this category.");
      return;
    }
    io.to(roomCode).emit("new-question", rows[0]);
  } catch (err) {
    console.error("DB Error:", err.message);
    io.to(roomCode).emit("error-msg", "Error fetching question.");
  }
}


app.post("/create-room", (req, res) => {
  const name = req.body.name;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const code = generateRoomCode();
  activeRooms[code] = { host: name, players: [], category: null };
  res.json({ roomCode: code });
});

io.on("connection", (socket) => {
  socket.on("join-room", ({ name, roomCode }) => {
    const room = activeRooms[roomCode];
    if (!room) return socket.emit("error-msg-join", "Room does not exist.");
    if (room.players.includes(name))
      return socket.emit("error-msg-join", "Player already in room.");
    socket.join(roomCode);
    room.players.push(name);
    io.to(roomCode).emit("room-players", { players: room.players, host: room.host });
  });
  
  socket.on("start-game", ({ roomCode, category }) => {
    const room = activeRooms[roomCode];
    if (!room) {
      return socket.emit("error-msg", "Room does not exist.");
    }

    room.category = category;
    io.to(roomCode).emit("game-started", roomCode);
    sendRandomQuestion(roomCode, category);
  });

  socket.on("next", ({roomCode}) => {
    sendRandomQuestion(roomCode);
  });

});

server.listen(3001, () => console.log("🚀 Backend on http://localhost:3001"));
