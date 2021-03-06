import React from "react";
import { connect } from "react-redux";
import { Chevron } from "../icons";
import { actions, selectors } from "../../domain";
import { cn } from "../";
import "./Breadcrumps.css";

type Props = ReturnType<typeof mapState>;

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
            danger: !this.props.dragState.isValid,
          })}
          onClick={() => actions.focusNode(item.id)}
          key={item.id}
          onMouseEnter={() => {
            if (this.props.dragState.cardDraggedId) {
              actions.setCardDestination(item.id, "breadcrump");
            }
          }}
          onMouseDown={() => {
            actions.mouseDown(item.id, {
              elementRect: { width: 200 } as any,
              itemOffsets: {
                x: 100,
                y: 100,
              },
              dragAvatarType: "small",
            });
          }}
          onMouseLeave={() => {
            if (this.props.dragState.cardDraggedId) {
              actions.setCardDestination("", undefined);
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
          className={cn({
            breadcrumps__section: true,
            "breadcrumps__section--dropTarget":
              this.props.dragState.dragArea === "breadcrump_section" &&
              this.props.dragState.cardUnderId === item.id,
            danger: !this.props.dragState.isValid,
          })}
          data-testid="breadcrump-section-text"
          onClick={() => actions.focusNode(item.id)}
          onMouseEnter={() => {
            if (this.props.dragState.cardDraggedId) {
              actions.setCardDestination(item.id, "breadcrump_section");
            }
          }}
          onMouseDown={() => {
            actions.mouseDown(item.id, {
              elementRect: { width: 200 } as any,
              itemOffsets: {
                x: 100,
                y: 100,
              },
              dragAvatarType: "small",
            });
          }}
          onMouseLeave={() => {
            if (this.props.dragState.cardDraggedId) {
              actions.setCardDestination("", undefined);
            }
          }}
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
    const path = selectors.getNodePath(items, focusedNodeId);
    return (
      <div
        className="breadcrumps"
        onMouseEnter={() => actions.setCardDragAvatarType("small")}
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

const mapState = (state: MyState) => ({
  focusedNodeId: state.nodeFocusedId,
  items: state.items,
  dragState: state.dragState,
});

export default connect(mapState)(Breadcrumps);
