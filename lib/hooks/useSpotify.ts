'use client';

import { useState, useEffect } from 'react';
import { SpotifyTrack, SpotifyState } from '../types/spotify';

// Default poll interval in milliseconds (30 seconds)
const DEFAULT_POLL_INTERVAL = 30000;

export function useSpotify(pollInterval = DEFAULT_POLL_INTERVAL) {
  const [state, setState] = useState<SpotifyState>({
    data: null,
    isLoading: true,
    error: null,
  });

  // Function to fetch the currently playing track
  const fetchNowPlaying = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await fetch('/api/spotify/now-playing');

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const data: SpotifyTrack = await response.json();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };

  // Set up polling to regularly update the currently playing track
  useEffect(() => {
    // Initial fetch
    fetchNowPlaying();

    // Set up polling interval
    const intervalId = setInterval(fetchNowPlaying, pollInterval);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [pollInterval]);

  // Return state and a manual refresh function
  return {
    ...state,
    refetch: fetchNowPlaying
  };
}

