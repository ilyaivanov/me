import React from "react";
import YouTube from "react-youtube";

const YoutubePlayer = ({ videoId }: { videoId: string }) => (
  <YouTube
    videoId={videoId}
    opts={playerOpts}
    onEnd={() => {
      console.log("on end");
    }}
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
