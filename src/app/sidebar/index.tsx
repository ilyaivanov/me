import React from "react";
import "./styles.css";
import { cn } from "../utils";
import { Chevron, Edit, Plus, Times } from "../icons";
import { actions, selectors } from "../state";
import { connect } from "react-redux";
import { sidebar as ids } from "../testId";

type SidebarProps = ReturnType<typeof mapState>;

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
        onMouseDown={(e) => e.stopPropagation()}
        value={this.state.newNodeName}
      />
    ) : (
      <span data-testid={ids.folderTitle(item.id)}>{item.title}</span>
    );

  stopRenameMode = () => {
    actions.changeItem(this.state.nodeBeingRenamed, {
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
    actions.changeItem(item.id, {
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
        onClick={() => actions.focusNode(item.id)}
        data-testid={ids.row(item.id)}
        onMouseEnter={() => {
          if (this.props.dragState.cardDraggedId) {
            actions.setCardDestination(item.id, "sidebar");
          }
        }}
        onMouseDown={() => {
          //Same as Subtrack handler
          actions.mouseDown(item.id, {
            dragAvatarType: "small",
            elementRect: { width: 200 } as any,
            itemOffsets: {
              x: 100,
              y: 100,
            },
          });
        }}
        onMouseLeave={() => {
          if (this.props.dragState.cardDraggedId) {
            actions.setCardDestination("", undefined);
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
              hidden: !selectors.hasAnySubfolders(this.props.items, item.id),
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
              actions.removeItem(item.id);
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
    const rows = selectors.traverseOpenNodes(this.props.items, "HOME", (item, level) => ({
      item,
      level,
    }))
      .filter(({ item }) => item.itemType === "folder")
      .map(this.renderRow);
    return (
      <div
        className="sidebar-content"
        onMouseEnter={() => actions.setCardDragAvatarType("small")}
      >
        <div
          className={cn({
            row: true,
            "row-mouse-over-during-drag":
              this.props.dragState.dragArea === "sidebar" &&
              "HOME" === this.props.dragState.cardUnderId,
          })}
          data-testid={ids.row("HOME")}
          onClick={() => actions.focusNode("HOME")}
          onMouseEnter={() => {
            if (this.props.dragState.cardDraggedId) {
              actions.setCardDestination("HOME", "sidebar");
            }
          }}
          onMouseLeave={() => {
            if (this.props.dragState.cardDraggedId) {
              actions.setCardDestination("", undefined);
            }
          }}
        >
          Home
        </div>
        {rows}
        <Plus
          className="icon plus-icon"
          onClick={actions.createNewFolder}
          data-testid={ids.addFolder}
        />
      </div>
    );
  }
}

const mapState = (state: MyState) => ({
  items: state.items,
  nodeFocusedId: state.nodeFocusedId,
  dragState: state.dragState,
});

export default connect(mapState)(Sidebar);
