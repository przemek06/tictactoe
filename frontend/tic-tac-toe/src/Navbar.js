import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CLIENT_ID, AWS_COGNITO_URL } from './config'
import axios from 'axios';

const Navbar = ({playerName, removeToken, removePlayerName, token, removeRefreshToken}) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const body = {
            AccessToken: token
          };

        try {
            const response = await axios.post(
                AWS_COGNITO_URL,
                body,
                {
                    headers: {
                        'Content-Type': 'application/x-amz-json-1.1',
                        'X-Amz-Target': 'AWSCognitoIdentityProviderService.GlobalSignOut'
                    }
                }
            )
            
            if (response.status == 200) {
                removeToken()
                removePlayerName()
                removeRefreshToken()
                navigate("/login")
            }
        } catch (error) {
            removeToken()
            removePlayerName()
            removeRefreshToken()
        }
    };

    const handleLogin = () => {
        navigate('/login')
    }

    return (
        <nav>
            {playerName !== '' && <button onClick={handleLogout}>Logout</button>}
            {playerName === '' && <button onClick={handleLogin}>Login</button>}
        </nav>
    );
};

export default Navbar;
