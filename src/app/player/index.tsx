import React from "react";
import YoutubePlayer from "./youtubePlayer";
import { allActions, RootState } from "../state";
import { connect } from "react-redux";

type Props = ReturnType<typeof mapState>;

const Player = ({ videoId }: Props) => {
  return (
    <div>
      <div className="youtube-player">
        {videoId && <YoutubePlayer videoId={videoId} />}
      </div>
    </div>
  );
};

const mapState = (state: RootState) => ({
  videoId:
    state.itemIdBeingPlayed && state.items[state.itemIdBeingPlayed].videoId,
});

export default connect(mapState, allActions)(Player);
