import React from "react";
import YouTube from "react-youtube";

interface Props {
  videoId: string;
  onVideoEn: () => void;
  onPlayerReady: (player: YoutubePlayerInstance) => void;
}

const YoutubePlayer = ({ videoId, onVideoEn, onPlayerReady }: Props) => (
  <YouTube
    videoId={videoId}
    opts={playerOpts}
    onEnd={onVideoEn}
    onReady={(e) => e.target && onPlayerReady(e.target)}
  />
);

export interface YoutubePlayerInstance {
  getDuration(): number;
  getCurrentTime(): number;

  //Returns a number between 0 and 1 that specifies the percentage of the video that the player shows as buffered.
  getVideoLoadedFraction(): number;

  getPlayerState(): PlayerState;
  playVideo(): void;
  pauseVideo(): void;

  mute(): void;

  unMute(): void;

  isMuted(): boolean;

  // Accepts an integer between 0 and 100.
  setVolume(volume: number): void;

  // Returns an integer between 0 and 100. 
  // Note that getVolume() will return the volume even if the player is muted.
  getVolume(): number;
}

export enum PlayerState {
  unstarted = -1,
  ended = 0,
  playing = 1,
  paused = 2,
  buffering = 3,
  videoCued = 5,
}

const playerOpts: any = {
  height: 150,
  width: 400,
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
  },
};

export default YoutubePlayer;
