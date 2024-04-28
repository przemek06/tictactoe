import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root'); // Set the root element for accessibility reasons

function onLogin(setPlayerName, name, navigate) {
  setPlayerName(name)
  navigate("/wait")
}

function UserForm({ setPlayerName }) {
  const [name, setName] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/player', { name });
      if (response.status === 200) {
        onLogin(setPlayerName, name, navigate);
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
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <button type="submit" disabled={!name.trim()}>Join Game</button>
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
