import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { CLIENT_ID, AWS_COGNITO_URL } from './config'
import axios from 'axios';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState(false)
  const navigate = useNavigate()


  const handleRegister = async (e) => {
    e.preventDefault();
    
    const body = {
      ClientId: CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email }
      ]
    };

    try {
      const response = await axios.post(
        AWS_COGNITO_URL,
        body,
        {
          headers: {
            'Content-Type': 'application/x-amz-json-1.1',
            'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp'
          }
        }
      )

      if (response.status == 200) {
        setIsCodeSent(true)
        setIsError(false)
      } else {
        setIsError(true)
      }
    } catch (e) {
      setIsError(true)
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    const body = {
      ClientId: CLIENT_ID,
      Username: username,
      ConfirmationCode: code
    };
    try {
      const response = await axios.post(
        AWS_COGNITO_URL,
        body,
        {
          headers: {
            'Content-Type': 'application/x-amz-json-1.1',
            'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmSignUp'
          }
        }
      )
  
      if (response.status == 200) {
        setIsError(false)
        setIsVerified(true)
        navigate("/login")
      } else {
        setIsError(true)
      }
    } catch (e) {
      console.log(e)
      setIsError(true)
    }


  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>

      {isCodeSent && !isVerified && (
        <form onSubmit={handleVerifyCode}>
          <div>
            <label>Verification Code:</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <button type="submit">Verify Code</button>
        </form>
      )}

      {isVerified && <p>Registration successful and code verified!</p>}
      {isError && <p style={{color: 'red'}}>There was an error during registration</p>}
      <p>Already have an account? <Link to='/login'>Login here</Link></p>
    </div>
  );
};

export default RegisterPage;
