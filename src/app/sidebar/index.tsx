import React from "react";
import "./styles.css";
import { cn } from "../utils";
import { Chevron, Edit, Plus, Times } from "../icons";
import { AllActions, allActions, Item, RootState } from "../state";
import { connect } from "react-redux";
import { hasAnySubfolders, traverseOpenNodes } from "../state/selectors";
import { sidebar as ids } from "../testId";

type SidebarProps = ReturnType<typeof mapState> & AllActions;

class Sidebar extends React.Component<SidebarProps> {
  state = {
    nodeBeingRenamed: "",
    newNodeName: "",
  };

  renderText = (item: Item) =>
    item.id === this.state.nodeBeingRenamed ? (
      <input
        ref={(ref) => ref?.focus()}
        data-testid={ids.folderInput(item.id)}
        onBlur={this.stopRenameMode}
        type="text"
        onClick={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.key === "Enter" && this.stopRenameMode()}
        onChange={(e) => this.setState({ newNodeName: e.currentTarget.value })}
        value={this.state.newNodeName}
      />
    ) : (
      <span data-testid={ids.folderTitle(item.id)}>{item.title}</span>
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

  arrowClicked = (item: Item) =>
    this.props.changeNode(item.id, {
      isOpenFromSidebar: !item.isOpenFromSidebar,
    });

  renderRow = ({ item, level }: { item: Item; level: number }) => {
    const { dragState } = this.props;
    return (
      <div
        key={item.id}
        className={cn({
          row: true,
          focused: item.id === this.props.nodeFocusedId,
          "row-mouse-over-during-drag":
            dragState.dragArea === "sidebar" &&
            item.id === dragState.cardUnderId,
        })}
        title={item.title}
        style={{ paddingLeft: level * 20 }}
        onClick={() => this.props.focusNode(item.id)}
        data-testid={ids.row(item.id)}
        onMouseEnter={() => {
          if (this.props.dragState.cardDraggedId) {
            this.props.setCardDestination(item.id, "sidebar");
          }
        }}
        onMouseLeave={() => {
          if (this.props.dragState.cardDraggedId) {
            this.props.setCardDestination("", undefined);
          }
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            this.arrowClicked(item);
          }}
        >
          <Chevron
            data-testid={ids.rowArrow(item.id)}
            className={cn({
              "icon row-arrow": true,
              hidden: !hasAnySubfolders(this.props.items, item.id),
              "row-arrow-open": item.isOpenFromSidebar,
            })}
          />
        </div>
        <div className="circle" />
        {this.renderText(item)}
        <div className="row-buttons">
          <Edit
            onClick={(e) => {
              e.stopPropagation();
              this.enterRenameMode(item);
            }}
            data-testid={ids.renameFolder(item.id)}
            className={"icon row-buttons-icon"}
          />
          <Times
            onClick={(e) => {
              this.props.removeItem(item.id);
              e.stopPropagation();
            }}
            data-testid={ids.removeFolder(item.id)}
            className={"icon icon-danger row-buttons-icon"}
          />
        </div>
      </div>
    );
  };
  render() {
    //TODO: consider extract this heavy-duty operations into selectors
    // and maybe try to see if using reselect has any benefits
    const rows = traverseOpenNodes(this.props.items, "HOME", (item, level) => ({
      item,
      level,
    }))
      .filter(({ item }) => item.itemType === "folder")
      .map(this.renderRow);
    return (
      <div className="sidebar-content">
        <div
          className={cn({
            row: true,
            "row-mouse-over-during-drag":
              this.props.dragState.dragArea === "sidebar" &&
              "HOME" === this.props.dragState.cardUnderId,
          })}
          data-testid={ids.row("HOME")}
          onClick={() => this.props.focusNode("HOME")}
          onMouseEnter={() => {
            if (this.props.dragState.cardDraggedId) {
              this.props.setCardDestination("HOME", "sidebar");
            }
          }}
          onMouseLeave={() => {
            if (this.props.dragState.cardDraggedId) {
              this.props.setCardDestination("", undefined);
            }
          }}
        >
          Home
        </div>
        {rows}
        <Plus
          className="icon plus-icon"
          onClick={this.props.createNewFolder}
          data-testid={ids.addFolder}
        />
      </div>
    );
  }
}

const mapState = (state: RootState) => ({
  items: state.items,
  nodeFocusedId: state.nodeFocusedId,
  dragState: state.dragState,
});

export default connect(mapState, allActions)(Sidebar);
