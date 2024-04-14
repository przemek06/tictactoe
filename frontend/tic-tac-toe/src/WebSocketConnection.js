import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function WebSocketConnection({ playerName, onMatchFound }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/stomp');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, function() {
      stompClient.subscribe('/player/' + playerName, function(message) {
        onMatchFound(JSON.parse(message.body));
        setLoading(false);
      });
    });

    return () => {
      stompClient.disconnect();
    };
  }, [playerName, onMatchFound]);

  return (
    <div>
      {loading ? <p>Waiting for another player...</p> : <p>Match found!</p>}
    </div>
  );
}

export default WebSocketConnection;
