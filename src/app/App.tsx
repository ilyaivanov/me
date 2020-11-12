import React, { useEffect } from "react";
import "./App.css";
import { cn } from "./utils";
import { connect } from "react-redux";
import { allActions, AllActions, RootState } from "./state";
import Sidebar from "./sidebar";
import Gallery from "./gallery";
import Player from "./player";
import Header from "./header";
import { ids } from "./gallery/pageObject";

interface Props extends AllActions {
  isSidebarVisible: boolean;
}
const App = (props: Props) => {
  return (
    <div className="page-container">
      <aside
        data-testid="sidebar"
        className={cn({
          "navigation-sidebar": true,
          closed: !props.isSidebarVisible,
        })}
      >
        <Sidebar />
      </aside>
      <div className="body-header">
        <Header />
      </div>
      <div className="page-body">
        <Gallery isSidebarVisible={props.isSidebarVisible} />
      </div>
      <Player />
      <DndAvatarConnected />
    </div>
  );
};

type DndAvatarProps = AllActions & ReturnType<typeof mapDragState>;

type DragStateType = "no_drag" | "mouse_down" | "dragging";

class DndAvatar extends React.Component<DndAvatarProps> {
  state = {
    dragState: "no_drag" as DragStateType,
    event: undefined as MouseEvent | undefined,
  };

  distance = 0;
  onMouseMove = (e: MouseEvent) => {
    if (this.props.dragState.cardDraggedId) {
      if (this.state.dragState === "dragging") {
        this.setState({ event: e });
      } else {
        const { movementX, movementY } = e;
        this.distance += Math.sqrt(
          movementX * movementX + movementY * movementY
        );
        if (this.distance >= 5) {
          this.setState({ dragState: "dragging", event: e });
        }
      }
    }
  };

  onMouseUp = () => {
    this.props.onMouseUp();
    this.setState({ dragState: "no_drag" });
  };
  componentDidMount() {
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  }
  componentWillUnmount() {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mousemove", this.onMouseUp);
  }

  render() {
    if (this.state.dragState === "dragging" && this.state.event)
      return (
        <div
          style={{
            position: "fixed",
            top: this.state.event.y,
            left: this.state.event.x,
          }}
          data-testid={ids.dragAvatar}
        >
          Dragging
        </div>
      );
    else return <div></div>;
  }
}
const mapDragState = (state: RootState) => ({
  dragState: state.dragState,
});
const DndAvatarConnected = connect(mapDragState, allActions)(DndAvatar);

const mapState = (state: RootState) => ({
  isSidebarVisible: state.isSidebarVisible,
});

export default connect(mapState, allActions)(App);
