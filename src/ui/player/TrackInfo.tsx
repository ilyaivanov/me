import React from "react";
import { cn } from "..";

interface Props {
  text: string;
  channelTitle: string | undefined;
  parentTitle: string | undefined;
}
class TrackInfo extends React.PureComponent<Props> {
  containerRef = React.createRef<HTMLDivElement>();
  textRef = React.createRef<HTMLDivElement>();
  state = {
    containerWidthMinusText: 0,
  };
  componentDidMount() {
    window.addEventListener("resize", this.calculateTextOffset);
    this.calculateTextOffset();
  }

  componentDidUpdate(prevProps: Props) {
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
        <div className="trackInfo__playlist__title">
          {this.props.channelTitle} - {this.props.parentTitle}
        </div>
        <div className="gradient-after"></div>
        <div className="gradient-before"></div>
      </div>
    );
  }
}
export default TrackInfo;
