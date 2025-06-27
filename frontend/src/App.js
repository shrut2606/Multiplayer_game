import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io("http://localhost:3001");

function App() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState(""); // <- new state for error message

  useEffect(() => {
    socket.on("room-players", (data) => {
      setPlayers(data);
      setError(""); // Clear error on successful update
    });

    socket.on("error-msg", msg => {
      setError(msg); // <- set error message from server
      setJoined(false);
    });
  }, []);

  const createRoom = async () => {
    const res = await axios.get("/create-room");
    const code = res.data.roomCode;
    setRoomCode(code);

    // Call joinRoom *after* setting state completely
    socket.emit("join-room", { name, roomCode: code });
    setJoined(true);
  };


  const joinRoom = () => {
  socket.emit("join-room", { name, roomCode });
  setJoined(true);
};


  return (
    <div style={{ padding: 20 }}>
      {!joined ? (
        <>
          <h2>Enter Your Name</h2>
          <input value={name} onChange={e => setName(e.target.value)} />
          
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
        </>
      )}
    </div>
  );
}

export default App;
