
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const socket = io("http://localhost:3001");

function Lobby() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [joined, setJoined] = useState(false);
  const [host, setHost] = useState("");
  const [error, setError] = useState(""); // <- new state for error message

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("room-players", (data) => {
      setPlayers(data.players);
      setHost(data.host);
      setError("");
    });


    socket.on("error-msg-join", msg => {
      setError(msg);
      setJoined(false);
    });

    socket.on("game-started", (roomCode) => {
      navigate(`/game/${roomCode}`);
    });
  }, [navigate]);

  const createRoom = async () => {
    const res = await axios.post("/create-room",{name:name});
    const code = res.data.roomCode;
    setRoomCode(code);
    
    // join the host
    socket.emit("join-room", { name, roomCode: code });
    setJoined(true);
  };


  const joinRoom = () => {
    socket.emit("join-room", { name, roomCode });
    setRoomCode(roomCode);
    setJoined(true);
  };

  const startGame=()=>{
    socket.emit("start-game", roomCode);
  }


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
          {host==name?(
            <button onClick={startGame}>Start Game</button>
            ):(
              <h2>Waiting for the  Host ({host}) to start the game</h2>
          )}
        </>
      )}
    </div>
  );
}

export default Lobby;
