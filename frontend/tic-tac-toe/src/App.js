import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
          matchData ? <Navigate to="/game" replace /> : <UserForm onLogin={setPlayerName} />
        } />
        <Route path="/wait" element={
          <WebSocketConnection playerName={playerName} onMatchFound={setMatchData} />
        } />
        <Route path="/game" element={
          matchData ? <GameBoard matchData={matchData} /> : <Navigate to="/" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
