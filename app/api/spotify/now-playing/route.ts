import { NextResponse } from 'next/server';
import spotifyApi, { refreshAccessToken } from '@/lib/spotify';
import { TrackObjectFull, EpisodeObject } from 'spotify-web-api-node';

// Type guard to check if the item is a track
function isTrack(item: any): item is TrackObjectFull {
  return item && 'artists' in item && 'album' in item;
}

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
    
    // Common properties for both track and episode
    const commonData = {
      isPlaying: response.body.is_playing,
      title: item.name,
      songUrl: item.external_urls.spotify
    };
    
    // Check if it's a track or an episode and extract relevant data
    if (isTrack(item)) {
      // It's a music track
      const trackData = {
        ...commonData,
        artist: item.artists.map(artist => artist.name).join(', '),
        album: item.album.name,
        albumImageUrl: item.album.images[0]?.url,
        type: 'track'
      };
      
      return NextResponse.json(trackData, { status: 200 });
    } else {
      // It's a podcast episode (cast to EpisodeObject for type safety)
      const episode = item as unknown as EpisodeObject;
      const episodeData = {
        ...commonData,
        show: episode.show?.name || 'Unknown Show',
        publisher: episode.show?.publisher || 'Unknown Publisher',
        albumImageUrl: episode.images?.[0]?.url,
        type: 'episode'
      };
      
      return NextResponse.json(episodeData, { status: 200 });
    }
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

