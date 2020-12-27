import React from "react";
import { connect } from "react-redux";
import { cn } from "..";
import { actions } from "../../domain";
import { Arrow, Delete, Search } from "../icons";
import "./contextMenu.css";

type Props = ReturnType<typeof mapState>;

class ContextMenu extends React.Component<Props> {
  mouseInMenu = false;
  componentDidMount() {
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
    window.addEventListener("mousedown", this.handleScreenMouseDown);
  }

  componentWillUnmount() {
    window.removeEventListener("mousedown", this.handleScreenMouseDown);
  }

  handleScreenMouseDown = () => {
    if (!this.mouseInMenu) this.hideContextMenu();
  };

  performContextAction = (action: () => void) => {
    action();
    this.hideContextMenu();
  };

  hideContextMenu = () =>
    actions.setContextMenu({
      ...this.props.state,
      nodeUnderId: "",
      type: "hidden",
    });

  render() {
    const { state } = this.props;
    return (
      <div
        className={cn({
          "context-menu": true,
          visible: state.type === "shown",
        })}
        style={{
          top: state.y,
          left: state.x,
        }}
        onMouseEnter={() => (this.mouseInMenu = true)}
        onMouseLeave={() => (this.mouseInMenu = false)}
      >
        {state.nodeType == "video" && (
          <div
            className="context-menu__row"
            onClick={() =>
              this.performContextAction(() =>
                actions.findSimilarVideos(state.nodeUnderId)
              )
            }
          >
            <Search className="context-menu__row-icon" />
            <div className="text">Find similar</div>
          </div>
        )}
        {state.nodeType == "other" && (
          <div
            className="context-menu__row"
            onClick={() =>
              this.performContextAction(() =>
                actions.focusNode(state.nodeUnderId)
              )
            }
          >
            <Arrow className="context-menu__row-icon" />
            <div className="text">
              Focus <div className="sub-text">(double click on card)</div>
            </div>
          </div>
        )}
        <div
          className="context-menu__row danger"
          onClick={() =>
            this.performContextAction(() =>
              actions.removeItem(state.nodeUnderId)
            )
          }
        >
          <Delete className="context-menu__row-icon" />
          <div className="text">Delete</div>
        </div>
      </div>
    );
  }
}

const mapState = (state: MyState) => ({
  state: state.contextMenuState,
});

export default connect(mapState)(ContextMenu);
