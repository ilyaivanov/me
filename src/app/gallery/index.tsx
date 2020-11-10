import React from "react";
import "./index.css";
import Card from "./Card";
import { interpolate } from "../utils";

const GAP = 20;
const minCardWidth = 240;
const maxCardWidth = 500;

interface Props {
  isSidebarVisible: boolean;
}

class Gallery extends React.Component<Props> {
  state = {
    cols: 0,
  };
  ref: HTMLDivElement | undefined;
  recalculateColumnsCountTimeout: ReturnType<typeof setTimeout> | undefined;

  getNumberOfColumns = () => {
    return Math.floor(
      ((this.ref?.scrollWidth || 0) - GAP) / (minCardWidth + GAP)
    );
  };

  recalculateColumnsCount = () => {
    const newColumns = this.getNumberOfColumns();
    if (newColumns != this.state.cols) this.setState({ cols: newColumns });
  };

  onRefReady = (element: HTMLDivElement) => {
    if (element && !this.ref) {
      this.ref = element;
      this.recalculateColumnsCount();
    }
  };

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.recalculateColumnsCountTimeout) {
      clearTimeout(this.recalculateColumnsCountTimeout);
    }
    if (prevProps.isSidebarVisible !== this.props.isSidebarVisible) {
      //wait for sidebar animation to finish
      this.recalculateColumnsCountTimeout = setTimeout(
        this.recalculateColumnsCount,
        200
      );
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.recalculateColumnsCount);
  }
  componentWillUnmount() {
    if (this.recalculateColumnsCountTimeout) {
      clearTimeout(this.recalculateColumnsCountTimeout);
    }
    window.removeEventListener("resize", this.recalculateColumnsCount);
  }

  render() {
    const { cols } = this.state;
    return (
      <div
        className="gallery-container"
        ref={this.onRefReady}
      >
        {Array.from({ length: cols }).map((_, index) => (
          <div
            key={index}
            className="column"
            data-testid={`gallery-column-${index + 1}`}
          >
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        ))}
      </div>
    );
  }
}

export default Gallery;
