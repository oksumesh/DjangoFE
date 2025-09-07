import { CredentialResponse } from '@react-oauth/google';

// Google OAuth configuration - Web client ID (replace with your new client ID)
export const GOOGLE_CLIENT_ID = '749338388642-8avu2kr7c66p6blq917dglu0v30k6tb0.apps.googleusercontent.com';

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string | null;
  given_name: string | null;
  family_name: string | null;
  picture: string | null;
  idToken: string;
}

export const handleGoogleSuccess = async (credentialResponse: CredentialResponse): Promise<GoogleUserInfo> => {
  if (!credentialResponse.credential) {
    throw new Error('No credential received from Google');
  }

  try {
    // Decode the JWT token to get user info
    const base64Url = credentialResponse.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const userInfo = JSON.parse(jsonPayload);

    return {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      given_name: userInfo.given_name,
      family_name: userInfo.family_name,
      picture: userInfo.picture,
      idToken: credentialResponse.credential
    };
  } catch (error) {
    console.error('Error decoding Google credential:', error);
    throw new Error('Failed to process Google authentication');
  }
};

export const handleGoogleError = () => {
  console.error('Google authentication failed');
  throw new Error('Google authentication failed');
};
