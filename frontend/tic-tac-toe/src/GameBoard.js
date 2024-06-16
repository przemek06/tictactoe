import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import BACKEND_HOST from './host';
import refreshTokenIfExpired from './utils';

function GameBoard({ matchData, playerName, token, refreshToken, setToken }) {
  const [board, setBoard] = useState(matchData.fields);
  const [result, setResult] = useState(null);
  const [player, setPlayer] = useState(null);
  const playerRef = useRef(player);  
  const socket = new SockJS(`${BACKEND_HOST}/stomp`);
  const stompClient = Stomp.over(socket);

  // Subscribe to moves
  useEffect(() => {
    console.log("MATCH DATA PLAYER: " + matchData.player1.name);
    setPlayer(matchData.player1);
    playerRef.current = matchData.player1;
    console.log("START PLAYER: " + playerRef.current.name);

    console.log("OPEN")
    if (!stompClient.connected) {
      stompClient.connect({}, function() {
        stompClient.subscribe('/topic/match/' + matchData.uuid, function(message) {
          const body = JSON.parse(message.body);
          if (body.type == "MOVE") {
            const update = JSON.parse(message.body).match;
            setBoard(update.fields);
            console.log("UPDATE PLAYER: " + playerRef.current.name)
            if (matchData.player1.name == playerRef.current.name) {
              setPlayer(update.player2)
              playerRef.current = update.player2
            } else {
              setPlayer(update.player1)
              playerRef.current = update.player1
            }
          } else {
            const res = body.won === null ? "Draw" : "Winner: " + body.won.name;
            setResult(res);
          }
        });
      });
    }
  }, []);

  const handleFieldClick = async (x, y) => {
    const move = {
      player: playerName,
      field: { x, y }
    };
    try {
      await refreshTokenIfExpired(token, refreshToken, setToken)
      await axios.post(
        `${BACKEND_HOST}/match/${matchData.uuid}`, 
        move,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          }
        }
    );
    } catch (error) {
      console.error('Error sending move:', error);
    }
  };

const rows = 3;
const rowLength = Math.sqrt(board.length);

return (
  <div>
    <h3>Current Turn: {player ? player.name : ''}</h3>
    <h2 hidden={result == null}>{result}</h2>
    <div className="board">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="board-row">
          {board.slice(i * rowLength, (i + 1) * rowLength).map((field, j) => (
            <button key={j} disabled={(playerName!=(player ? player.name : '')) || result} onClick={() => handleFieldClick(field.x, field.y)}>
              {field.occupant ? field.occupant.name : ' '}
            </button>
          ))}
        </div>
      ))}
    </div>
  </div>
);
}


export default GameBoard;
