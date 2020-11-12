import React from "react";
import YouTube from "react-youtube";

interface Props {
  videoId: string;
  onVideoEn: () => void;
}

const YoutubePlayer = ({ videoId, onVideoEn }: Props) => (
  <YouTube videoId={videoId} opts={playerOpts} onEnd={onVideoEn} />
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
