import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import BACKEND_HOST from './host';
import refreshTokenIfExpired from './utils';

Modal.setAppElement('#root'); // Set the root element for accessibility reasons

function onLogin(navigate) {
  navigate("/wait")
}

function UserForm({ playerName, token, refreshToken, setToken }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [history, setHistory] = useState([])
  const navigate = useNavigate()

  useEffect(() => { 
    const fetchData = async () => { 
      try { 
        const response = await axios.get(`${BACKEND_HOST}/history`);
        const data = await response.data
        setHistory(data)
      }
      catch (e) {
        alert("Could not load history")
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    await refreshTokenIfExpired(token, refreshToken, setToken)
    const name = playerName
    try {
      const response = await axios.post(
        `${BACKEND_HOST}/player`, 
        { name }, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          }
        }
      );      
      if (response.status === 200) {
        onLogin(navigate);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage('This username is already taken. Please choose another.');
        setModalOpen(true);
      }
    }
  };

  return (
    <div>
      <h2>Hello {playerName}!</h2>
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={!playerName.trim()}>Join Game</button>
      </form>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Error Modal"
      >
        <h2>Error</h2>
        <p>{errorMessage}</p>
        <button onClick={() => setModalOpen(false)}>Close</button>
      </Modal>
      <h2>Match history</h2>
      <ul>
        {history.map((item, index) => (
          <li key={index}>Winner: {item.winner}, Loser: {item.loser}, Match Date: {(new Date(item.timestamp)).toISOString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserForm;
