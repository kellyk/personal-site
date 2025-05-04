import { NextRequest, NextResponse } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';

export async function GET(request: NextRequest) {
  // Get the authorization code from the URL
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Handle error case
  if (error || !code) {
    return new NextResponse(
      `<html>
        <head>
          <title>Spotify Authentication Error</title>
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; }
            .error { color: red; background: #ffeeee; padding: 1rem; border-radius: 0.5rem; }
            code { background: #f5f5f5; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <h1>Authentication Error</h1>
          <div class="error">
            <p>${error || 'No authorization code received from Spotify'}</p>
          </div>
          <p>Please try again by <a href="javascript:history.back()">going back</a> and reauthorizing.</p>
        </body>
      </html>`,
      { status: 400, headers: { 'Content-Type': 'text/html' } }
    );
  }

  // Set up Spotify Web API with client credentials
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/spotify/callback',
  });

  try {
    // Exchange the authorization code for access and refresh tokens
    const data = await spotifyApi.authorizationCodeGrant(code);
    
    // Get the tokens
    const accessToken = data.body.access_token;
    const refreshToken = data.body.refresh_token;
    const expiresIn = data.body.expires_in;

    // Return a page displaying the refresh token
    return new NextResponse(
      `<html>
        <head>
          <title>Spotify Authentication Success</title>
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; }
            .success { color: green; background: #eeffee; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; }
            .token-box { background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; overflow-wrap: break-word; }
            .instructions { background: #ffffee; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; }
            code { background: #e5e5e5; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <h1>Authentication Successful!</h1>
          <div class="success">
            <p>Your Spotify account has been connected successfully.</p>
          </div>
          
          <h2>Your Refresh Token</h2>
          <div class="token-box" onclick="this.select();">
            ${refreshToken}
          </div>
          
          <div class="instructions">
            <h3>Next Steps:</h3>
            <ol>
              <li>Copy the refresh token above.</li>
              <li>Open your <code>.env.local</code> file in your project.</li>
              <li>Replace <code>your_refresh_token_here</code> with the token you just copied.</li>
              <li>Restart your development server with <code>npm run dev</code>.</li>
            </ol>
          </div>
          
          <p>Access token expires in ${expiresIn} seconds, but the refresh token will allow your app to get new access tokens automatically.</p>
        </body>
      </html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
    
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    
    return new NextResponse(
      `<html>
        <head>
          <title>Spotify Token Exchange Error</title>
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; }
            .error { color: red; background: #ffeeee; padding: 1rem; border-radius: 0.5rem; }
          </style>
        </head>
        <body>
          <h1>Token Exchange Error</h1>
          <div class="error">
            <p>There was an error exchanging the authorization code for tokens.</p>
            <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
          <p>Please make sure your client ID and client secret are correct in your .env.local file.</p>
          <p>You can try again by <a href="javascript:history.back()">going back</a> and reauthorizing.</p>
        </body>
      </html>`,
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
}

