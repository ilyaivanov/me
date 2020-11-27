import React from "react";
import { connect } from "react-redux";
import { Chevron } from "../icons";
import { AllActions, allActions, Item, RootState } from "../state";
import { findParentId } from "../state/selectors";
import { cn } from "../utils";
import "./Breadcrumps.css";

type Props = ReturnType<typeof mapState> & AllActions;

class Breadcrumps extends React.Component<Props> {
  renderOptions = (items: Item[], highlightedId: string | undefined) => (
    <div className="options">
      {items.map((item) => (
        <div
          className={cn({
            options__item: true,
            "options__item--selected": highlightedId === item.id,
            "options__item--dropTarget":
              this.props.dragState.dragArea === "breadcrump" &&
              this.props.dragState.cardUnderId === item.id,
          })}
          onClick={() => this.props.focusNode(item.id)}
          key={item.id}
          onMouseEnter={() => {
            if (this.props.dragState.cardDraggedId) {
              this.props.setCardDestination(item.id, "breadcrump");
            }
          }}
          onMouseDown={() => {
            this.props.onMouseDownForCard(
              item.id,
              { width: 200 } as any,
              {
                x: 100,
                y: 100,
              },
              "small"
            );
          }}
          onMouseLeave={() => {
            if (this.props.dragState.cardDraggedId) {
              this.props.setCardDestination("", undefined);
            }
          }}
        >
          {item.title}
        </div>
      ))}
    </div>
  );

  renderOptionsForItem = (
    parentId: string,
    nextItemInSectionId: string | undefined
  ) => {
    const items = this.props.items[parentId].children.map(
      (id) => this.props.items[id]
    );
    return this.renderOptions(items, nextItemInSectionId);
  };

  renderSection = (item: Item, nextItemInSectionId: string | undefined) => {
    return (
      <React.Fragment key={item.id}>
        <div
          className="breadcrumps__section"
          data-testid="breadcrump-section-text"
          onClick={() => this.props.focusNode(item.id)}
        >
          {item.title}
        </div>
        <div className="breadcrumps__section icon-hover-container">
          <Chevron className="icon breadcrumps__arrow__icon" />
          <div className="breadcrumps__drawer">
            {this.renderOptionsForItem(item.id, nextItemInSectionId)}
          </div>
        </div>
      </React.Fragment>
    );
  };
  render() {
    const { items, focusedNodeId } = this.props;
    const path: Item[] = [];
    let parentId = focusedNodeId;
    while (parentId) {
      path.push(items[parentId]);
      parentId = findParentId(items, parentId);
    }
    path.reverse();
    return (
      <div
        className="breadcrumps"
        onMouseEnter={() => this.props.setCardDragAvatar("small")}
      >
        <div className="breadcrumps__section icon-hover-container">
          <Chevron className="icon breadcrumps__arrow__icon" />
          <div className="breadcrumps__drawer">
            {this.renderOptions([items["HOME"]], "HOME")}
          </div>
        </div>
        {path.map((item, index) =>
          this.renderSection(item, path[index + 1]?.id)
        )}
      </div>
    );
  }
}

const mapState = (state: RootState) => ({
  focusedNodeId: state.nodeFocusedId,
  items: state.items,
  dragState: state.dragState,
});

export default connect(mapState, allActions)(Breadcrumps);
