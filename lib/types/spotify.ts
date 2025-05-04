// Spotify Track interface
export interface SpotifyTrack {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  message?: string;
  error?: string;
}

// State interface for the useSpotify hook
export interface SpotifyState {
  data: SpotifyTrack | null;
  isLoading: boolean;
  error: string | null;
}

