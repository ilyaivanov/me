import React from "react";
import "./index.css";
import { cn } from "../utils";
import { Chevron } from "../icons";
import {
  AllActions,
  allActions,
  Item,
  NodesContainer,
  RootState,
} from "../state";
import { connect } from "react-redux";
import { hasAnySubfolders, traverseOpenNodes } from "../state/selectors";

interface SidebarProps extends AllActions {
  items: NodesContainer;
  nodeFocusedId: string;
}

class Sidebar extends React.Component<SidebarProps> {
  state = {
    nodeBeingRenamed: "",
    newNodeName: "",
  };

  renderText = (item: Item) =>
    item.id === this.state.nodeBeingRenamed ? (
      <input
        ref={(ref) => ref?.focus()}
        data-testid={"folder-input-" + item.id}
        onBlur={this.stopRenameMode}
        type="text"
        onChange={(e) => this.setState({ newNodeName: e.currentTarget.value })}
        value={this.state.newNodeName}
      />
    ) : (
      <span data-testid={"folder-title-" + item.id}>{item.title}</span>
    );

  stopRenameMode = () => {
    this.props.changeNode(this.state.nodeBeingRenamed, {
      title: this.state.newNodeName,
    });
    this.setState({
      nodeBeingRenamed: "",
      newNodeName: "",
    });
  };

  enterRenameMode = (item: Item) => {
    this.setState({
      nodeBeingRenamed: item.id,
      newNodeName: item.title,
    });
  };

  renderRow = (item: Item, level: number) => {
    return (
      <div
        key={item.id}
        className={cn({
          row: true,
          focused: item.id === this.props.nodeFocusedId,
        })}
        title={item.title}
        style={{ paddingLeft: level * 20 }}
        onClick={() => this.props.focusNode(item.id)}
        data-testid={`sidebar-row-${item.id}`}
      >
        <Chevron
          data-testid="row-arrow"
          className={cn({
            "row-arrow": true,
            hidden: !hasAnySubfolders(this.props.items, item.id),
            "row-arrow-open": item.isOpenFromSidebar,
          })}
        />
        <div className="circle" />
        {this.renderText(item)}
        <button
          onClick={(e) => {
            this.props.removeItem(item.id);
            e.stopPropagation();
          }}
          data-testid={`folder-remove-${item.id}`}
        >
          X
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            this.enterRenameMode(item);
          }}
          data-testid={`folder-rename-${item.id}`}
        >
          e
        </button>
      </div>
    );
  };
  render() {
    //TODO: consider extract this heavy-duty operations into selectors
    // and maybe try to see if using reselect has any benefits
    const rows = traverseOpenNodes(this.props.items, "HOME", this.renderRow);
    return (
      <div className="sidebar-content">
        <div
          className="row"
          data-testid={"sidebar-row-HOME"}
          onClick={() => this.props.focusNode("HOME")}
        >
          Home
        </div>
        {rows}
        <button onClick={this.props.createNewFolder} data-testid="folder-add">
          add
        </button>
      </div>
    );
  }
}

const mapState = (state: RootState) => ({
  items: state.items,
  nodeFocusedId: state.nodeFocusedId,
});

export default connect(mapState, allActions)(Sidebar);