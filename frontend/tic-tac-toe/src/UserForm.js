import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility reasons

function UserForm({ onLogin }) {
  const [name, setName] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/player', { name });
      if (response.status === 200) {
        onLogin(name);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
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
