import { NextResponse } from 'next/server';
import spotifyApi, { refreshAccessToken } from '@/lib/spotify';

export const dynamic = 'force-dynamic'; // Ensure the route is never cached

export async function GET() {
  try {
    // Refresh the access token before making any request
    await refreshAccessToken();

    // Fetch the user's currently playing track
    const response = await spotifyApi.getMyCurrentPlayingTrack();
    
    // If no track is playing
    if (response.statusCode === 204 || !response.body || !response.body.item) {
      return NextResponse.json({ 
        isPlaying: false,
        message: 'Not playing anything currently' 
      }, { status: 200 });
    }

    const item = response.body.item;
    
    // Extract relevant track data
    const track = {
      isPlaying: response.body.is_playing,
      title: item.name,
      artist: item.artists.map(artist => artist.name).join(', '),
      album: item.album.name,
      albumImageUrl: item.album.images[0]?.url,
      songUrl: item.external_urls.spotify
    };

    return NextResponse.json(track, { status: 200 });
  } catch (error) {
    console.error('Error fetching currently playing track:', error);
    return NextResponse.json(
      { 
        isPlaying: false,
        error: 'Error fetching Spotify data',
        message: (error as Error).message 
      }, 
      { status: 500 }
    );
  }
}

