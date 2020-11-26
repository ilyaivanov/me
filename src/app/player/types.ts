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

  seekTo(duration: number): void;
}

export enum PlayerState {
  unstarted = -1,
  ended = 0,
  playing = 1,
  paused = 2,
  buffering = 3,
  videoCued = 5,
}