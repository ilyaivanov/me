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
          })}
          onClick={() => this.props.focusNode(item.id)}
          key={item.id}
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
        <div className="breadcrumps__section">
          <Chevron className="breadcrumps__arrow" />
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
      <div>
        <div className="breadcrumps">
          <div className="breadcrumps__section">
            <Chevron className="breadcrumps__arrow" />
            <div className="breadcrumps__drawer">
              {this.renderOptions([items["HOME"]], "HOME")}
            </div>
          </div>
          {path.map((item, index) =>
            this.renderSection(item, path[index + 1]?.id)
          )}
        </div>
      </div>
    );
  }
}

const mapState = (state: RootState) => ({
  focusedNodeId: state.nodeFocusedId,
  items: state.items,
});

export default connect(mapState, allActions)(Breadcrumps);
