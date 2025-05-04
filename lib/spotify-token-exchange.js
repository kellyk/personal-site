/**
 * Spotify Token Exchange Helper
 * 
 * This script exchanges an authorization code for a refresh token
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });
const https = require('https');

// Get credentials from environment variables
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// The authorization code you received from Spotify
const CODE = 'AQBt5za3Xf0_kOtFZ6QGXdKohMtfdWd_2kFODAeFcT6NSO5zWv49Mw4MlzyOKi3ievjIs2M8TuzxdOfCXeQ0FnMQaV8pbpkeKBFsB9UyaK8qpFNn_G4aC47_zsZKmtIUa6PRY6EX-oVXyR4UlZCyNUCsdjtF1HArnWPBtAoYMXyZzQ2VFSBhINkpAnr_bKeyny0N_lANGVX2A_0-dESrFrPwKe2jEh_JhTyo3Pt_1Ts7oWEMs4arftmM9Zcp9CUtr-IRJWkBbHyt6FObnBr5Z0SpYXSV747I-YdsUhRYVC4D9iyKN552Nq4tQMarghjMNRoBIOW5JUFp5KmHMamRcZ0usTaJ7lCUamK7gTSgFjT77FWXFA';

// Check if credentials are available
if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  console.error('ERROR: Missing Spotify credentials in .env.local. Make sure you have defined:');
  console.error('- SPOTIFY_CLIENT_ID');
  console.error('- SPOTIFY_CLIENT_SECRET');
  console.error('- SPOTIFY_REDIRECT_URI');
  process.exit(1);
}

// Prepare the request data
const authHeader = 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');
const data = new URLSearchParams({
  grant_type: 'authorization_code',
  code: CODE,
  redirect_uri: REDIRECT_URI
}).toString();

// Options for the HTTPS request
const options = {
  hostname: 'accounts.spotify.com',
  path: '/api/token',
  method: 'POST',
  headers: {
    'Authorization': authHeader,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': data.length
  }
};

// Make the request to Spotify API
const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(responseData);
      
      if (response.error) {
        console.error('Error from Spotify API:', response.error);
        console.error('Error description:', response.error_description);
        process.exit(1);
      }
      
      if (response.refresh_token) {
        console.log('\n===== SUCCESS =====');
        console.log('Refresh token obtained successfully!\n');
        console.log('Your refresh token is:');
        console.log(response.refresh_token);
        console.log('\nPlease update your .env.local file with:');
        console.log(`SPOTIFY_REFRESH_TOKEN=${response.refresh_token}`);
        console.log('\nAccess token (expires in', response.expires_in, 'seconds):');
        console.log(response.access_token);
      } else {
        console.error('No refresh token returned from Spotify API.');
        console.error('Response:', responseData);
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      console.error('Raw response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('Error making request to Spotify API:', error);
});

// Write the data to the request body and send it
req.write(data);
req.end();

console.log('Exchanging authorization code for tokens...');

