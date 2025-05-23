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

// Basic unknown item type with minimal properties we check for
export interface UnknownSpotifyItem {
  type?: string;
  name?: string;
  external_urls?: SpotifyExternalUrls;
  [key: string]: unknown;
}

// Union type for currently playing items
export type SpotifyItem = SpotifyTrackObject | SpotifyEpisodeObject;

// Currently playing response structure from the Spotify API
export interface SpotifyCurrentlyPlayingResponse {
  isPlaying: boolean;
  item: SpotifyItem | null;
  progress_ms: number | null;
  timestamp: number;
}

//==============================
// 2. Type Guards
//==============================

// Type guards - we can use 'unknown' for maximum flexibility or the union type for safety
export type SpotifyItemOrUnknown = SpotifyItem | Record<string, unknown>;

// Type guard to check if the item is a track
export function isSpotifyTrack(item: SpotifyItemOrUnknown): item is SpotifyTrackObject {
  return Boolean(item &&
    typeof item === 'object' &&
    item !== null &&
    'type' in item &&
    item.type === 'track' &&
    'artists' in item &&
    'album' in item);
}

// Type guard to check if the item is an episode
export function isSpotifyEpisode(item: SpotifyItemOrUnknown): item is SpotifyEpisodeObject {
  return Boolean(item &&
    typeof item === 'object' &&
    item !== null &&
    'type' in item &&
    item.type === 'episode' &&
    'show' in item);
}

//==============================
// 3. Client-side Types
//==============================

// Formatted response structure for the client
export interface NowPlayingResponse {
  isPlaying: boolean;
  title?: string;
  artists?: [{name: string}];
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

