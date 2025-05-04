/**
 * Spotify Authorization Helper
 * 
 * This file helps generate the authorization URL for Spotify integration
 * and includes instructions on how to get the refresh token.
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Get credentials from environment variables
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// Check if credentials are available
if (!CLIENT_ID) {
  console.error('ERROR: SPOTIFY_CLIENT_ID is not defined in .env.local');
  process.exit(1);
}

if (!REDIRECT_URI) {
  console.error('ERROR: SPOTIFY_REDIRECT_URI is not defined in .env.local');
  process.exit(1);
}

// Define all required scopes for the integration
const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-read-email',
  'user-read-private'
];

// Create the authorization URL
const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES.join(' '))}&show_dialog=true`;

console.log(`
=== Spotify Authorization Instructions ===

1. Replace 'your_client_id_here' in this file with your actual Spotify Client ID
2. Run this file with: node lib/spotify-auth-helper.js
3. Open the printed URL in your browser
4. Log in to Spotify and authorize the app
5. You'll be redirected to your redirect URI with a 'code' parameter in the URL
6. Use that code to get a refresh token by following these steps:

   Run this curl command (replace CLIENT_ID, CLIENT_SECRET, and CODE with your values):

   curl -X POST -H "Content-Type: application/x-www-form-urlencoded" \\
   -d "grant_type=authorization_code&redirect_uri=${REDIRECT_URI}&code=CODE" \\
   -u 'CLIENT_ID:CLIENT_SECRET' \\
   https://accounts.spotify.com/api/token

7. The response will include a 'refresh_token'. Add this to your .env.local file.

Authorization URL (open in browser after replacing CLIENT_ID):
${authorizationUrl}
`);

