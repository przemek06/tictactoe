import { REFRESH_TOKEN_AUTH_FLOW, AWS_COGNITO_URL, CLIENT_ID } from './config'
import axios from 'axios';

const refreshTokenIfExpired = async (accessToken, refreshToken, setToken) => {
    const body = {
        AccessToken: accessToken
    }

    try {
        const response = await axios.post(
            AWS_COGNITO_URL,
            body,
            {
              headers: {
                'Content-Type': 'application/x-amz-json-1.1',
                'X-Amz-Target': 'AWSCognitoIdentityProviderService.GetUser'
              }
            }
        )        

        if (response.status != 200) {
            throw -1;
        }
    } catch (e) {
        const refreshTokenBody = {
            AuthFlow: REFRESH_TOKEN_AUTH_FLOW,
            ClientId: CLIENT_ID,
            AuthParameters: {
                REFRESH_TOKEN: refreshToken
            }
        }

        try {
            const refreshResponse = await axios.post(
                AWS_COGNITO_URL,
                refreshTokenBody,
                {
                    headers: {
                        'Content-Type': 'application/x-amz-json-1.1',
                        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth'
                    }
                }
            )

            if (refreshResponse.status === 200) {
                const responseBody = await refreshResponse.data
                const accessToken = responseBody.AuthenticationResult.AccessToken; 
                setToken(accessToken)
            }
        } catch (e) {
            alert("Auth error")
        }
    }
}

export default refreshTokenIfExpired