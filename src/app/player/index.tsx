import React from "react";
import YoutubePlayer from "./youtubePlayer";
import {AllActions, allActions, RootState} from "../state";
import { connect } from "react-redux";

type Props = ReturnType<typeof mapState> & AllActions;

const Player = (props : Props) => {
  return (
    <div>
      <div className="youtube-player">
        {props.videoId && <YoutubePlayer videoId={props.videoId} onVideoEn={props.onVideoEnd} />}
      </div>
    </div>
  );
};

const mapState = (state: RootState) => ({
  videoId:
    state.itemIdBeingPlayed && state.items[state.itemIdBeingPlayed].videoId,
});

export default connect(mapState, allActions)(Player);
