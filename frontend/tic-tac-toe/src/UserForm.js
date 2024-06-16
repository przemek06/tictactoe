import React, { useState } from 'react';
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
  const navigate = useNavigate()

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
    </div>
  );
}

export default UserForm;
