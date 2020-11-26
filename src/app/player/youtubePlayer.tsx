import React from "react";
import YouTube from "react-youtube";
import { YoutubePlayerInstance } from "./types";

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

const playerOpts: any = {
  height: 150,
  width: 400,
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
  },
};

export default YoutubePlayer;
