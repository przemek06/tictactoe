import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import UserForm from './UserForm';
import WebSocketConnection from './WebSocketConnection';
import GameBoard from './GameBoard';
import useLocalStorage from "./useLocalStorage"
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Navbar from './Navbar';

function App() {
  const [playerName, setPlayerName, removePlayerName] = useLocalStorage('username', '');
  const [token, setToken, removeToken] =  useLocalStorage('token', '');
  const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage('refreshToken', '')
  const [matchData, setMatchData] = useState(null);

  return (
    <Router>
      <Navbar removePlayerName={removePlayerName} removeToken={removeToken} playerName={playerName} token = {token} removeRefreshToken={removeRefreshToken}/>
      <Routes>
        <Route path="/" element={ 
          playerName ? <UserForm playerName={playerName} token={token} refreshToken={refreshToken} setToken={setToken} /> : <Navigate to="/login" replace />
        } />
        <Route path="/wait" element={
          <WebSocketConnection playerName={playerName} setMatchData={setMatchData} />
        } />
        <Route path="/game" element={
          matchData ? <GameBoard matchData={matchData} playerName={playerName} token={token} refreshToken={refreshToken} setToken={setToken} /> : <Navigate to="/" replace />
        } />
        <Route path='/login' element = {
           <LoginPage setPlayerName={setPlayerName} setToken={setToken} setRefreshToken={setRefreshToken} />
        } />
        <Route path='/register' element = {
          <RegisterPage />
        } />
      </Routes>
    </Router>
  );
}


export default App;
