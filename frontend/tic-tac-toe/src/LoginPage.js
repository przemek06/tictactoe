import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { USER_PASS_AUTH_FLOW, AWS_COGNITO_URL, CLIENT_ID } from './config'
import axios from 'axios';


const LoginPage = ({setPlayerName, setToken, setRefreshToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();

    const body = {
      AuthFlow: USER_PASS_AUTH_FLOW,
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    };
    try {
      const response = await axios.post(
        AWS_COGNITO_URL,
        body,
        {
          headers: {
            'Content-Type': 'application/x-amz-json-1.1',
            'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth'
          }
        }
      )

      if (response.status == 200) {
        const responseBody = await response.data
        console.log(responseBody)
        const accessToken = responseBody.AuthenticationResult.AccessToken
        const refreshToken = responseBody.AuthenticationResult.RefreshToken
        setRefreshToken(refreshToken)
        setPlayerName(username)
        setToken(accessToken)
        setIsError(false)
        navigate("/")
      }
    } catch (e) {
      console.log(e)
      setIsError(true)
    }

  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to='/register'>Register here</Link></p>
      {isError && <p style={{color: 'red'}}>There was an error during login</p>}
    </div>
  );
};

export default LoginPage;
