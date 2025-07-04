// src/Game.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import socket from './socket';

export default function Game() {
  const { roomCode } = useParams();
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    socket.on("new-question", q => {
      setQuestion(q);
    });
    return () => socket.off("new-question");
  }, []);

  if (!question) return <p>Loading question…</p>;

  const nextt=()=>{
    socket.emit("next", { roomCode });
  }
  return (
    <div style={{ padding: 20 }}>
      <h2>Room: {roomCode}</h2>
      <h3>{question.text}</h3>
      {question.question_type === 'mcq' ? (
        question.choices.map((opt, i) => (
          <button key={i} style={{ display: 'block', margin: '8px 0' }}>
            {opt}
          </button>
        ))
      ) : (
        <input placeholder="Type your answer" />
      )}
      <button onClick={nextt}>next question</button>
    </div>
  );
}
