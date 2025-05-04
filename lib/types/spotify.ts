// Spotify API types for type-safe handling of responses and data structures

//==============================
// 1. API Response Types
//==============================

// Basic types
export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyImage {
  url: string;
  height?: number;
  width?: number;
}

// Artist in a track
export interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
  external_urls: SpotifyExternalUrls;
}

// Album containing a track
export interface SpotifyAlbum {
  id: string;
  name: string;
  uri: string;
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
}

// Podcast show containing episodes
export interface SpotifyShow {
  id: string;
  name: string;
  publisher: string;
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
}

// Track object (music)
export interface SpotifyTrackObject {
  id: string;
  name: string;
  uri: string;
  type: 'track';
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  external_urls: SpotifyExternalUrls;
  duration_ms: number;
}

// Episode object (podcast)
export interface SpotifyEpisodeObject {
  id: string;
  name: string;
  uri: string;
  type: 'episode';
  show: SpotifyShow;
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
  duration_ms: number;
}

// Union type for currently playing items
export type SpotifyItem = SpotifyTrackObject | SpotifyEpisodeObject;

// Currently playing response structure from the Spotify API
export interface SpotifyCurrentlyPlayingResponse {
  is_playing: boolean;
  item: SpotifyItem | null;
  progress_ms: number | null;
  timestamp: number;
}

//==============================
// 2. Type Guards
//==============================

// Type guard to check if the item is a track
export function isSpotifyTrack(item: any): item is SpotifyTrackObject {
  return item && item.type === 'track' && 'artists' in item && 'album' in item;
}

// Type guard to check if the item is an episode
export function isSpotifyEpisode(item: any): item is SpotifyEpisodeObject {
  return item && item.type === 'episode' && 'show' in item;
}

//==============================
// 3. Client-side Types
//==============================

// Formatted response structure for the client
export interface NowPlayingResponse {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  type?: 'track' | 'episode';
  show?: string;
  publisher?: string;
  message?: string;
  error?: string;
}

// State structure for the useSpotify hook
export interface SpotifyState {
  data: NowPlayingResponse | null;
  isLoading: boolean;
  error: string | null;
}

