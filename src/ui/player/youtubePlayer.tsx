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
  width: "100%",
  height: "100%",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
  },
};

export default YoutubePlayer;
