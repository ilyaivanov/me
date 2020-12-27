import React from "react";
import { connect } from "react-redux";
import "./index.css";

import Card from "./Card";
import { gallery as ids } from "../testId";
import Breadcrumps from "../../ui/breadcrumps";
import CardsTransitionAnimation from "./CardsTransitionAnimation";
type Props = ReturnType<typeof mapState>;

class Gallery extends React.PureComponent<Props> {
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
    const focusedId = this.props.itemFocused?.id;
    const allItems = this.props.allItems;
    const items = focusedId
      ? allItems[focusedId].children.map((id) => allItems[id])
      : [];
    return (
      <>
        <Breadcrumps />
        <CardsTransitionAnimation nodeFocusedId={this.props.itemFocused.id}>
          <>
            <div className="gallery-container" data-testid={"gallery"}>
              {this.props.searchState.stateType === "loading"
                ? this.renderLoadingIndicator(this.props.searchState.term)
                : items.map(this.renderCard)}
            </div>
            {this.props.itemFocused.youtubePlaylistNextPageId &&
              this.props.searchState.stateType !== "loading" && (
                <div style={{ position: "relative", minHeight: 100 }}>
                  {this.renderLoadingIndicator()}
                </div>
              )}
          </>
        </CardsTransitionAnimation>
      </>
    );
  }
}

function mapState(state: MyState) {
  return {
    allItems: state.items,
    searchState: state.searchState,
    itemFocused: state.items[state.nodeFocusedId],
  };
}

export default connect(mapState)(Gallery);
