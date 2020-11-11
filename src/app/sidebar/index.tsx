import React from "react";
import "./index.css";
import { cn } from "../utils";
import { Chevron } from "../icons";
import { allActions, Item, NodesContainer, RootState } from "../state";
import { connect } from "react-redux";
import { hasAnySubfolders, traverseOpenNodes } from "../state/selectors";

const Sidebar = ({ items }: { items: NodesContainer }) => {
  //TODO: consider extract this heavy-duty operations into selectors
  // and maybe try to see if using reselect has any benefits
  const rows = traverseOpenNodes(items, "HOME", (item, level) => (
    <Row key={item.id} item={item} level={level} items={items} />
  ));
  return <div className="sidebar-content">{rows}</div>;
};

interface RowProps {
  item: Item;
  items: NodesContainer;
  level: number;
}

const Row = ({ item, items, level = 0 }: RowProps) => (
  <div
    className="row"
    title={item.title}
    style={{ paddingLeft: level * 20 }}
    data-testid={`sidebar-row-${item.id}`}
  >
    <Chevron
      data-testid="row-arrow"
      className={cn({
        "row-arrow": true,
        hidden: !hasAnySubfolders(items, item.id),
        "row-arrow-open": item.isOpenFromSidebar,
      })}
    />
    <div className="circle" />
    <span>{item.title}</span>
  </div>
);

const mapState = (state: RootState) => ({
  items: state.items,
});

export default connect(mapState, allActions)(Sidebar);
