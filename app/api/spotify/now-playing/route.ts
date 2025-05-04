import { NextResponse } from 'next/server';
import spotifyApi, { refreshAccessToken } from '@/lib/spotify';
import {
  isSpotifyTrack,
  isSpotifyEpisode,
  SpotifyItemOrUnknown,
  NowPlayingResponse,
} from '@/lib/types/spotify';

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

    // Cast the item to our utility type that allows safe type checking
    const item = response.body.item as SpotifyItemOrUnknown;

    // Common properties for both track and episode
    // Safely access properties that might not exist on unknown types
    const commonData: Partial<NowPlayingResponse> = {
      isPlaying: response.body.is_playing,
      title: item && 'name' in item ? item.name as string : 'Unknown Track',
      songUrl: item && 'external_urls' in item && item.external_urls && 'spotify' in item.external_urls
        ? item.external_urls.spotify as string
        : undefined
    };

    // Check if it's a track or an episode and extract relevant data
    if (isSpotifyTrack(item)) {
      // It's a music track
      const trackData: NowPlayingResponse = {
        ...commonData as NowPlayingResponse,
        artist: item.artists.map(artist => artist.name).join(', '),
        album: item.album.name,
        albumImageUrl: item.album.images[0]?.url,
        type: 'track'
      };

      return NextResponse.json(trackData, { status: 200 });
    } else if (isSpotifyEpisode(item)) {
      // It's a podcast episode
      const episodeData: NowPlayingResponse = {
        ...commonData as NowPlayingResponse,
        show: item.show?.name || 'Unknown Show',
        publisher: item.show?.publisher || 'Unknown Publisher',
        albumImageUrl: item.images?.[0]?.url,
        type: 'episode'
      };

      return NextResponse.json(episodeData, { status: 200 });
    } else {
      // Unknown item type
      return NextResponse.json({
        isPlaying: response.body.is_playing,
        message: 'Currently playing unsupported media type'
      }, { status: 200 });
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

