// src/Lobby.jsx
import React, { useState, useEffect } from 'react';
import socket from './socket';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Lobby() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [joined, setJoined] = useState(false);
  const [host, setHost] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("room-players", ({ players, host }) => {
      setPlayers(players);
      setHost(host);
      setError("");
    });
    socket.on("error-msg-join", msg => {
      setError(msg);
      setJoined(false);
    });
    socket.on("game-started", code => {
      navigate(`/game/${code}`);
    });
    return () => socket.off("room-players").off("error-msg-join").off("game-started");
  }, [navigate]);

  const createRoom = async () => {
    const res = await axios.post("/create-room", { name });
    const code = res.data.roomCode;
    setRoomCode(code);
    socket.emit("join-room", { name, roomCode: code });
    setJoined(true);
  };

  const joinRoom = () => {
    socket.emit("join-room", { name, roomCode });
    setJoined(true);
  };

  const startGame = () => {
    if (!category) return setError("Please select a category");
    socket.emit("start-game", { roomCode, category });
  };

  return (
    <div style={{ padding: 20 }}>
      {!joined ? (
        <>
          <h2>Enter Your Name</h2>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <br /><br />
          <button onClick={createRoom}>Create Room</button>
          <br /><br />
          <input
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={e => setRoomCode(e.target.value.toUpperCase())}
          />
          <button onClick={joinRoom}>Join Room</button>
          {error && <div style={{ color: "red", marginTop: 5 }}>{error}</div>}
        </>
      ) : (
        <>
          <h2>Room Code: {roomCode}</h2>
          <h3>Players in Room:</h3>
          <ul>
            {players.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
          {host === name ? (
            <div style={{ marginTop: 20 }}>
              <h4>Select Category:</h4>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="" disabled>--Choose--</option>
                <option value="bollywood">Bollywood</option>
                <option value="cricket">Cricket</option>
                <option value="science_maths">Science & Maths</option>
                <option value="general_knowledge">General Knowledge</option>
                <option value="facts">Facts</option>
              </select>
              <br /><br />
              <button
                onClick={startGame}
                disabled={!category}
              >
                Start Game
              </button>
            </div>
          ) : (
            <h3>Waiting for host ({host}) to start the game…</h3>
          )}
          {error && <div style={{ color: "red", marginTop: 5 }}>{error}</div>}
        </>
      )}
    </div>
  );
}
