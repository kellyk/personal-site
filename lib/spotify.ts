import SpotifyWebApi from 'spotify-web-api-node';

// These values should be moved to environment variables in a production environment
const clientId = process.env.SPOTIFY_CLIENT_ID || '';
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN || '';

// Determine if we're in production or development
const isDevelopment = process.env.NODE_ENV === 'development';

// Set the appropriate redirect URI based on environment
let redirectUri = process.env.SPOTIFY_REDIRECT_URI;

if (!redirectUri) {
  if (isDevelopment) {
    // Use http for local development
    redirectUri = 'http://localhost:3000/api/spotify/callback';
  } else {
    // For production, use the Vercel URL if available
    const vercelUrl = process.env.VERCEL_URL || 'personal-site-g5p040ss3-kngs-projects-a525a851.vercel.app';
    
    // Ensure we use https in production
    redirectUri = `https://${vercelUrl}/api/spotify/callback`;
  }
}

console.log(`Spotify configured with redirectUri: ${redirectUri}`);

// Initialize the Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
  redirectUri,
});

// Set the refresh token if it exists
if (refreshToken) {
  spotifyApi.setRefreshToken(refreshToken);
}

/**
 * Refreshes the access token using the refresh token
 * @returns A promise that resolves to the new access token
 */
export const refreshAccessToken = async () => {
  try {
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body.access_token);
    return data.body.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

export default spotifyApi;

