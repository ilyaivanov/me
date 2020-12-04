import React from "react";
import "./index.css";

import Card from "./Card";
import { Item } from "../state/store";
import { MyState } from "../state/store";
import { connect } from "react-redux";
import { gallery as ids } from "../testId";
import Breadcrumps from "./Breadcrumps";

const GAP = 20;
const minCardWidth = 240;

interface Props extends ReturnType<typeof mapState> {
  isSidebarVisible: boolean;
}

class Gallery extends React.Component<Props> {
  state = {
    cols: 0,
  };
  ref: HTMLDivElement | undefined;
  recalculateColumnsCountTimeout: ReturnType<typeof setTimeout> | undefined;

  getNumberOfColumns = () => {
    return Math.max(
      Math.floor(((this.ref?.scrollWidth || 0) - GAP) / (minCardWidth + GAP)),
      1
    );
  };

  recalculateColumnsCount = () => {
    const newColumns = this.getNumberOfColumns();
    if (newColumns !== this.state.cols) this.setState({ cols: newColumns });
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

  renderCard = (item: Item) => {
    return (
      <Card
        width={`calc(${100 / this.state.cols}% - 20px - (20px / ${
          this.state.cols
        }))`}
        key={item.id}
        item={item}
        isPlaying={false}
      />
    );
  };

  renderLoadingIndicator = (text?: string) => (
    <div className="overlay flex-center" data-testid={ids.loadingIndicator}>
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
      {text}
    </div>
  );

  render() {
    return (
      <>
        <Breadcrumps />
        <div
          className="gallery-container"
          ref={this.onRefReady}
          data-testid={"gallery"}
        >
          {this.props.searchState.stateType === "loading"
            ? this.renderLoadingIndicator(
                `Searching for '${this.props.searchState.term}'...`
              )
            : this.props.items.map(this.renderCard)}
        </div>
        {this.props.itemFocused.youtubePlaylistNextPageId && (
          <div style={{ position: "relative", minHeight: 100 }}>
            {this.renderLoadingIndicator()}
          </div>
        )}
      </>
    );
  }
}

function mapState(state: MyState) {
  return {
    items: state.items[state.nodeFocusedId].children.map(
      (id) => state.items[id]
    ),
    allItems: state.items,
    searchState: state.searchState,
    itemFocused: state.items[state.nodeFocusedId],
  };
}

export default connect(mapState)(Gallery);
