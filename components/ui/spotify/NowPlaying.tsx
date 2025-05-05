// Spotify Now Playing component

import { useSpotify } from "@/lib/hooks/useSpotify";

export const NowPlaying = () => {
  const { data, isLoading, error } = useSpotify();

  console.log({data})
  if (isLoading) {
    return <div className="animate-pulse">🎧 Loading music...</div>;
  }

  if (error) {
    return <div>🎧 Couldn&apos;t load music data</div>;
  }

  if (!data?.isPlaying) {
    return <div>🎧 Not playing anything right now</div>;
  }

  return (
    <div className="flex items-center justify-center gap-2 mb-2">
      <div className="animate-pulse">🎧</div>
      <span>Now playing: </span>
      <a
        href={data.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-pink-600 hover:underline flex items-center"
      >
        {data.title} | { data.artists ? data.artists.map(artist => artist.name).join(', ') : null}
      </a>
    </div>
  );
};
