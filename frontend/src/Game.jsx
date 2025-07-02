import React from 'react';
import { useParams } from 'react-router-dom';

export default function Game() {
  const { roomCode } = useParams();

  return (
    <>
      <h1>Game Room: {roomCode}</h1>
      <h2>TODO: fetch questions, start timers, render chat & quiz UI here</h2>
    </>
  );
}