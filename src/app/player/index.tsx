import React from "react";
import YoutubePlayer, { PlayerState, YoutubePlayerInstance } from "./youtubePlayer";
import { AllActions, allActions, RootState } from "../state";
import { connect } from "react-redux";
import "./styles.css";
import { Play, Forward, VolumeMax, Pause } from "../icons";
import { cn } from "../utils";
import { formatVideoTime } from "./utils";

type Props = ReturnType<typeof mapState> & AllActions;

class Player extends React.Component<Props> {
  interval: NodeJS.Timeout | undefined;

  state = {
    duration: 0,
    currentTime: 0,
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

  render() {
    const { itemBeingPlayed, onVideoEnd } = this.props;
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
        <div className="youtube-player">
          {itemBeingPlayed && itemBeingPlayed.videoId && (
            <YoutubePlayer
              videoId={itemBeingPlayed.videoId}
              onVideoEn={onVideoEnd}
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
          <Forward className="backward-icon" />
          {itemBeingPlayed && this.player?.getPlayerState() === PlayerState.playing ? (
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
          <Forward className="forward-icon" />
        </div>
        <div className="player__rightPart__container">
          <VolumeMax className="volume-icon" />
          <input type="range" />
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
