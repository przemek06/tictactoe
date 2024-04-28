import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function onMatchFound(setMatchData, match, navigate) {
  setMatchData(match)
  console.log("NAVIGATE")
  navigate("/game")
}

function WebSocketConnection({ playerName, setMatchData }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/stomp');
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, function() {
      stompClient.subscribe('/topic/player/' + playerName, function(message) {
        setLoading(false);
        onMatchFound(setMatchData, JSON.parse(message.body).match, navigate);
        stompClient.disconnect();
      });
    });
  }, [playerName, onMatchFound]);

  return (
    <div>
      {loading ? <p>Waiting for another player...</p> : <p>Match found!</p>}
    </div>
  );
}

export default WebSocketConnection;
