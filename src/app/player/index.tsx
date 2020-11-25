import React from "react";
import YoutubePlayer, {
  PlayerState,
  YoutubePlayerInstance,
} from "./youtubePlayer";
import { AllActions, allActions, RootState } from "../state";
import { connect } from "react-redux";
import "./styles.css";
import {
  Play,
  Forward,
  VolumeMax,
  Pause,
  Youtube,
  VolumeMiddle,
  VolumeLow,
  VolumeMute,
} from "../icons";
import { cn } from "../utils";
import { formatVideoTime } from "./utils";

type Props = ReturnType<typeof mapState> & AllActions;

class Player extends React.Component<Props> {
  interval: NodeJS.Timeout | undefined;

  state = {
    duration: 0,
    currentTime: 0,
    isVideoShown: true,
    volume: 50,
    isMuted: false,
  };
  player: YoutubePlayerInstance | undefined;

  componentDidMount() {
    this.interval = setInterval(this.checkVideoTime, 200);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  checkVideoTime = () => {
    if (this.player) {
      this.setState({
        currentTime: this.player.getCurrentTime(),
        duration: this.player.getDuration(),
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
      return <VolumeMute onClick={this.unmute} className="volume-icon" />;

    if (this.state.volume > 66)
      return <VolumeMax onClick={this.mute} className="volume-icon" />;
    else if (this.state.volume > 33)
      return <VolumeMiddle onClick={this.mute} className="volume-icon" />;
    else if (this.state.volume > 0)
      return <VolumeLow onClick={this.mute} className="volume-icon" />;
    else return <VolumeMute onClick={this.unmute} className="volume-icon" />;
  };

  mute = () => {
    if (this.player) this.player.mute();
    this.setState({ isMuted: true });
  };

  unmute = () => {
    if (this.player) this.player.unMute();
    this.setState({ isMuted: false });
  };

  render() {
    const { itemBeingPlayed, playNextTrack, playPreviousTrack } = this.props;
    let trackWidth;
    if (this.state.duration)
      trackWidth = (this.state.currentTime / this.state.duration) * 100;
    else trackWidth = 0;
    return (
      <div className="page-player player__container">
        <div className="player__track__container">
          <div className="player__track">
            <div
              className="player__track__progress"
              style={{ width: `${trackWidth}%` }}
            >
              <div className="player__track__bulp" />
            </div>
          </div>
        </div>
        <div
          className={cn({
            youtube__player: true,
            "youtube__player--hidden": !this.state.isVideoShown,
          })}
        >
          {itemBeingPlayed && itemBeingPlayed.videoId && (
            <YoutubePlayer
              videoId={itemBeingPlayed.videoId}
              onVideoEn={playNextTrack}
              onPlayerReady={(player) => (this.player = player)}
            />
          )}
        </div>
        <div className="player__trackInfo__container">
          {itemBeingPlayed && (
            <>
              <img src={itemBeingPlayed.image} alt="" />
              <TrackInfoViz text={itemBeingPlayed.title} />
            </>
          )}
        </div>
        <div className="player__buttons__container">
          <Forward className="backward-icon" onClick={playPreviousTrack} />
          {itemBeingPlayed &&
          this.player?.getPlayerState() === PlayerState.playing ? (
            <Pause
              className="play-icon"
              onClick={() => {
                this.player?.pauseVideo();
              }}
            />
          ) : (
            <Play
              className="play-icon"
              onClick={() => {
                this.player?.playVideo();
              }}
            />
          )}
          <Forward className="forward-icon" onClick={playNextTrack} />
        </div>
        <div className="player__rightPart__container">
          <Youtube
            className="volume-icon"
            onClick={() =>
              this.setState({ isVideoShown: !this.state.isVideoShown })
            }
          />
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

interface TrackInfoVizProps {
  text: string;
}
class TrackInfoViz extends React.PureComponent<TrackInfoVizProps> {
  containerRef = React.createRef<HTMLDivElement>();
  textRef = React.createRef<HTMLDivElement>();
  state = {
    containerWidthMinusText: 0,
  };
  componentDidMount() {
    window.addEventListener("resize", this.calculateTextOffset);
    this.calculateTextOffset();
  }

  componentDidUpdate(prevProps: TrackInfoVizProps) {
    if (prevProps.text !== this.props.text) this.calculateTextOffset();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.calculateTextOffset);
  }

  calculateTextOffset = () => {
    const totalWidth =
      this.containerRef.current?.getBoundingClientRect().width || 0;
    const textWidth = this.textRef.current?.scrollWidth || 0;
    //20 is a width for gradient-after + gradient-before
    const containerWidthMinusText = totalWidth - textWidth - 20;

    if (containerWidthMinusText !== this.state.containerWidthMinusText)
      this.setState({ containerWidthMinusText });
  };

  render() {
    return (
      <div
        className="trackInfo_text"
        // @ts-expect-error
        style={{ "--my-height": `${this.state.containerWidthMinusText}px` }}
        ref={this.containerRef}
      >
        <span
          className={cn({
            trackInfo__title: true,
            trackInfo__title__animation: this.state.containerWidthMinusText < 0,
          })}
          ref={this.textRef}
        >
          {this.props.text}
        </span>
        <div className="trackInfo__playlist__title">Radio Intense</div>
        <div className="gradient-after"></div>
        <div className="gradient-before"></div>
      </div>
    );
  }
}

const mapState = (state: RootState) => {
  const item = state.itemIdBeingPlayed
    ? state.items[state.itemIdBeingPlayed]
    : undefined;
  return {
    videoId: item?.videoId,
    itemBeingPlayed: item,
  };
};

export default connect(mapState, allActions)(Player);
