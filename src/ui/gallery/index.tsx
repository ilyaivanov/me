import React from "react";
import { connect } from "react-redux";
import "./index.css";

import Card from "./Card";
import { gallery as ids } from "../testId";
import Breadcrumps from "../../ui/breadcrumps";

type Props = ReturnType<typeof mapState>;

class Gallery extends React.Component<Props> {
  renderCard = (item: Item) => {
    return (
      <div key={item.id}>
        <Card item={item} isPlaying={false} />
      </div>
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
        <div className="gallery-container" data-testid={"gallery"}>
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
