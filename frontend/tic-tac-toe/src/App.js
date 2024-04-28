import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import UserForm from './UserForm';
import WebSocketConnection from './WebSocketConnection';
import GameBoard from './GameBoard';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [matchData, setMatchData] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          matchData ? <Navigate to="/game" replace /> : <UserForm setPlayerName={setPlayerName} />
        } />
        <Route path="/wait" element={
          <WebSocketConnection playerName={playerName} setMatchData={setMatchData} />
        } />
        <Route path="/game" element={
          matchData ? <GameBoard matchData={matchData} playerName={playerName} /> : <Navigate to="/" replace />
        } />
      </Routes>
    </Router>
  );
}


export default App;
