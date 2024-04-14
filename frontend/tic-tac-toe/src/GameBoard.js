import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GameBoard({ matchData }) {
  const [board, setBoard] = useState(matchData.fields);
  const [currentPlayer, setCurrentPlayer] = useState(matchData.player1); // Assume player1 starts

  // Subscribe to moves
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/stomp');
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, function() {
      stompClient.subscribe('/match/' + matchData.uuid, function(message) {
        const update = JSON.parse(message.body);
        setBoard(update.fields);
        setCurrentPlayer(update.currentTurn);
      });
    });

    return () => {
      stompClient.disconnect();
    };
  }, [matchData]);

  const handleFieldClick = async (x, y) => {
    const move = {
      player: currentPlayer,
      field: { x, y }
    };
    try {
      await axios.post(`http://localhost:8080/match/${matchData.uuid}`, move);
    } catch (error) {
      console.error('Error sending move:', error);
    }
  };

  return (
    <div>
      <h3>Current Turn: {currentPlayer.name}</h3>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, cellIndex) => (
              <button key={cellIndex} onClick={() => handleFieldClick(rowIndex, cellIndex)}>
                {cell.occupant ? cell.occupant.name : ''}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
