import React from "react";
import { connect } from "react-redux";
import "./styles.css";
import {
  Play,
  Forward,
  VolumeMax,
  Pause,
  VolumeMiddle,
  VolumeLow,
  VolumeMute,
  Collapse,
  Expand,
  HideVideo,
  ShowVideo,
} from "../icons";
import { cn } from "../";
import { formatVideoTime } from "../../domain/time";
import { PlayerState, YoutubePlayerInstance } from "./types";
import ReactDOM from "react-dom";
import YoutubePlayer from "./youtubePlayer";
import { actions, selectors } from "../../domain";
import TrackInfo from "./TrackInfo";

interface OuterProps {
  galleryPlayer?: HTMLDivElement;
}

type Props = ReturnType<typeof mapState> & OuterProps;

class Player extends React.Component<Props> {
  updatePlayerInterval: NodeJS.Timeout | undefined;
  updateItemInterval: NodeJS.Timeout | undefined;
  state = {
    duration: 0,
    currentTime: 0,
    buffer: 0,
    volume: 50,
    isMuted: false,
    isVideoShown: true,
    isTheatreMode: false,
  };
  player: YoutubePlayerInstance | undefined;

  componentDidMount() {
    this.updatePlayerInterval = setInterval(this.updateVideoTime, 200);
    this.updateItemInterval = setInterval(this.updateItem, 2000);
    this.syncPlayerState();
  }

  componentDidUpdate() {
    this.syncPlayerState();
  }

  syncPlayerState() {
    if (
      this.player &&
      this.props.isPlaying !==
        (this.player.getPlayerState() === PlayerState.playing)
    ) {
      if (this.props.isPlaying) this.player.playVideo();
      else this.player.pauseVideo();
    }
  }

  componentWillUnmount() {
    if (this.updatePlayerInterval) clearInterval(this.updatePlayerInterval);
    if (this.updateItemInterval) clearInterval(this.updateItemInterval);
  }

  updateVideoTime = () => {
    if (this.player) {
      this.setState({
        currentTime: this.player.getCurrentTime(),
        duration: this.player.getDuration(),
        buffer: this.player.getVideoLoadedFraction(),
      });
    }
  };

  updateItem = () => {
    if (this.props.itemBeingPlayed && this.player) {
      actions.changeItem(this.props.itemBeingPlayed.id, {
        duration: this.player.getDuration(),
        currentTime: this.player.getCurrentTime(),
      });
    }
  };

  onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = e.currentTarget.value;
    this.setState({ volume });
    if (this.player) {
      this.player.setVolume(+volume);
      if (+volume === 0) this.mute();
      else this.unmute();
    }
  };

  renderVolumeIcon = () => {
    if (this.state.isMuted)
      return <VolumeMute onClick={this.unmute} className="icon volume-icon" />;

    if (this.state.volume > 66)
      return <VolumeMax onClick={this.mute} className="icon volume-icon" />;
    else if (this.state.volume > 33)
      return <VolumeMiddle onClick={this.mute} className="icon volume-icon" />;
    else if (this.state.volume > 0)
      return <VolumeLow onClick={this.mute} className="icon volume-icon" />;
    else
      return <VolumeMute onClick={this.unmute} className="icon volume-icon" />;
  };

  mute = () => {
    if (this.player) this.player.mute();
    this.setState({ isMuted: true });
  };

  unmute = () => {
    if (this.player) this.player.unMute();
    this.setState({ isMuted: false });
  };

  renderYoutubePlayer = () => {
    const { itemBeingPlayed } = this.props;
    return (
      <div
        className={cn({
          "youtube__player--hidden": !this.state.isVideoShown,
          "theater-player": this.state.isVideoShown && this.state.isTheatreMode,
          youtube__player:
            this.props.itemBeingPlayed &&
            (!this.state.isTheatreMode || !this.state.isVideoShown),
        })}
      >
        {itemBeingPlayed && itemBeingPlayed.videoId && (
          <YoutubePlayer
            videoId={itemBeingPlayed.videoId}
            onVideoEn={() => actions.playNextTrack()}
            onPlayerReady={(player) => {
              //@ts-expect-error
              global.player = player;
              this.player = player;
            }}
          />
        )}
      </div>
    );
  };

  createYoutubePlayer = () => {
    if (
      this.props.galleryPlayer &&
      this.state.isTheatreMode &&
      this.state.isVideoShown
    )
      return ReactDOM.createPortal(
        this.renderYoutubePlayer(),
        this.props.galleryPlayer
      );
    else return this.renderYoutubePlayer();
  };

  render() {
    const { itemBeingPlayed } = this.props;
    let trackWidth;
    if (this.state.duration)
      trackWidth = (this.state.currentTime / this.state.duration) * 100;
    else trackWidth = 0;
    return (
      <div className="page-player player__container">
        <div
          className="player__track__container"
          onMouseDown={(e) => {
            const ratio = e.clientX / window.innerWidth;
            if (this.player) {
              this.player.seekTo(ratio * this.state.duration);
            }
          }}
        >
          <div className="player__track">
            <div
              className="player__track__buffer"
              style={{ width: `${this.state.buffer * 100}%` }}
            />
            <div
              className="player__track__progress"
              style={{ width: `${trackWidth}%` }}
            >
              <div className="player__track__bulp" />
            </div>
          </div>
        </div>
        {this.createYoutubePlayer()}
        <div className="player__trackInfo__container">
          {itemBeingPlayed && (
            <>
              <img src={selectors.getVideoImage(itemBeingPlayed)} alt="" />
              <TrackInfo
                text={itemBeingPlayed.title}
                channelTitle={this.props.channelTitle}
                parent={selectors.getParent(
                  this.props.items,
                  this.props.itemBeingPlayed
                )}
              />
            </>
          )}
        </div>
        <div className="player__buttons__container">
          <Forward
            className="icon backward-icon"
            onClick={() => actions.playPreviousTrack()}
          />
          {itemBeingPlayed && this.props.isPlaying ? (
            <Pause
              className="icon play-icon"
              onClick={() => actions.setIsPlaying(false)}
            />
          ) : (
            <Play
              className="icon play-icon"
              onClick={() => actions.setIsPlaying(true)}
            />
          )}
          <Forward
            className="icon forward-icon"
            onClick={() => actions.playNextTrack()}
          />
        </div>
        <div className="player__rightPart__container">
          {this.state.isTheatreMode ? (
            <Collapse
              className="icon volume-icon"
              onClick={() => this.setState({ isTheatreMode: false })}
            />
          ) : (
            <Expand
              className="icon volume-icon"
              onClick={() => this.setState({ isTheatreMode: true })}
            />
          )}

          {this.state.isVideoShown ? (
            <HideVideo
              className="icon volume-icon"
              onClick={() => this.setState({ isVideoShown: false })}
            />
          ) : (
            <ShowVideo
              className="icon volume-icon"
              onClick={() => this.setState({ isVideoShown: true })}
            />
          )}

          {this.renderVolumeIcon()}
          <input
            type="range"
            value={this.state.isMuted ? 0 : this.state.volume}
            onChange={this.onVolumeChange}
            min={0}
            max={100}
          />
          <div className="player__track__time">
            {formatVideoTime(this.state.currentTime, this.state.duration)}
          </div>
        </div>
      </div>
    );
  }
}

const mapState = (state: MyState) => {
  const item = state.itemIdBeingPlayed
    ? state.items[state.itemIdBeingPlayed]
    : undefined;
  return {
    videoId: item?.videoId,
    channelTitle: item?.channelTitle,
    itemBeingPlayed: item,
    items: state.items,
    isPlaying: state.isPlaying,
  };
};

export default connect(mapState)(Player);
