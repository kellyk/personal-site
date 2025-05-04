import SpotifyWebApi from 'spotify-web-api-node';

// Get Spotify credentials from Next.js environment variables
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
const configuredRedirectUri = process.env.SPOTIFY_REDIRECT_URI;

// Check for missing required credentials
if (!clientId) {
  console.error('Missing SPOTIFY_CLIENT_ID environment variable');
}

if (!clientSecret) {
  console.error('Missing SPOTIFY_CLIENT_SECRET environment variable');
}

if (!refreshToken) {
  console.warn('Missing SPOTIFY_REFRESH_TOKEN environment variable - authentication may fail');
}

// Determine environment (development or production)
const isDevelopment = process.env.NODE_ENV === 'development';

// Set the appropriate redirect URI based on environment
let redirectUri = configuredRedirectUri;

if (!redirectUri) {
  if (isDevelopment) {
    // Use http for local development
    redirectUri = 'http://localhost:3000/api/spotify/callback';
  } else {
    // For production, use the Vercel URL if available
    const vercelUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
    
    if (vercelUrl) {
      // Ensure we use https in production
      redirectUri = `https://${vercelUrl}/api/spotify/callback`;
    } else {
      console.warn('No SPOTIFY_REDIRECT_URI or VERCEL_URL provided, using default fallback');
      redirectUri = 'https://personal-site-g5p040ss3-kngs-projects-a525a851.vercel.app/api/spotify/callback';
    }
  }
}

// Initialize the Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: clientId || '',
  clientSecret: clientSecret || '',
  redirectUri,
});

// Set the refresh token if it exists
if (refreshToken) {
  spotifyApi.setRefreshToken(refreshToken);
}

/**
 * Refreshes the access token using the refresh token
 * Implementation uses a new instance of SpotifyWebApi for refreshing tokens
 * to avoid the issue described in: 
 * https://github.com/thelinmichael/spotify-web-api-node/issues/147#issuecomment-331735279
 * 
 * @returns A promise that resolves to the new access token
 */
export async function refreshAccessToken() {
  try {
    console.log('Refreshing Spotify access token...');
    
    if (!refreshToken) {
      throw new Error('No refresh token available. Please set SPOTIFY_REFRESH_TOKEN in your environment variables.');
    }
    
    // Create a new instance of SpotifyWebApi specifically for refreshing the token
    const refreshApi = new SpotifyWebApi({
      clientId: clientId || '',
      clientSecret: clientSecret || '',
      refreshToken: refreshToken,
    });
    
    // Use the new instance to refresh the token
    const data = await refreshApi.refreshAccessToken();
    
    // Update the original instance with the new access token
    spotifyApi.setAccessToken(data.body.access_token);
    
    console.log('Access token refreshed successfully');
    return data.body.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
  }
}

export default spotifyApi;

