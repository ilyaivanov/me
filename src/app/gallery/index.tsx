import React from "react";
import "./index.css";
import Card from "./Card";
import { AllActions, allActions, Item, RootState } from "../state";
import { connect } from "react-redux";
import { getPreviewItemsForFolder } from "../state/selectors";
import { ids } from "./pageObject";

const GAP = 20;
const minCardWidth = 240;

interface Props extends ReturnType<typeof mapState>, AllActions {
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
    const previewImages =
      item.itemType === "folder"
        ? getPreviewItemsForFolder(this.props.allItems, item.id)
        : [];
    return (
      <Card
        key={item.id}
        item={item}
        isPlaying={false}
        folderFirstItems={previewImages}
      />
    );
  };

  renderCards = () =>
    createIntegers(this.state.cols).map((columnIndex) => (
      <div
        key={columnIndex}
        className="column"
        data-testid={`gallery-column-${columnIndex + 1}`}
      >
        {this.props.items
          .filter((_, i) => i % this.state.cols === columnIndex)
          .map(this.renderCard)}
      </div>
    ));

  renderLoadingIndicator = () => (
    <div data-testid={ids.loadingIndicator}>Loading</div>
  );

  render() {
    return (
      <div className="gallery-container" ref={this.onRefReady}>
        {this.props.searchState === "loading"
          ? this.renderLoadingIndicator()
          : this.renderCards()}
      </div>
    );
  }
}

function mapState(state: RootState) {
  return {
    items: state.items[state.nodeFocusedId].children.map(
      (id) => state.items[id]
    ),
    allItems: state.items,
    searchState: state.searchState,
  };
}

export default connect(mapState, allActions)(Gallery);

//creates integers starting from 0 up to upTo (exclusive)
const createIntegers = (upTo: number) =>
  Array.from(new Array(upTo)).map((_, i) => i);
