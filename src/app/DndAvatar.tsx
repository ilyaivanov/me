import { allActions, AllActions, RootState } from "./state";
import React from "react";
import { ids } from "./gallery/pageObject";
import { connect } from "react-redux";
import Card from "./gallery/Card";
import { cn } from "./utils";

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
        console.log(movementX, movementY);
        if (this.distance >= 5) {
          this.setState({ dragState: "dragging", event: e });
        }
      }
    }
  };

  onMouseUp = () => {
    this.distance = 0;
    this.setState({ dragState: "no_drag" });
    this.props.onMouseUp();
  };
  componentDidMount() {
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  }
  componentWillUnmount() {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  }

  render() {
    const { itemOffsets } = this.props.dragState;
    if (
      this.state.dragState === "dragging" &&
      this.state.event &&
      itemOffsets
    ) {
      const inOnLeftHalf =
        itemOffsets.x < (this.props.dragState.itemDraggedRect?.width || 0) / 2;
      return (
        <div
          className={cn({
            "drag-avatar": true,
            "rotate-ccw": inOnLeftHalf,
            "rotate-cw": !inOnLeftHalf,
          })}
          style={{
            position: "fixed",
            transformOrigin: `${itemOffsets.x}px ${itemOffsets.y}px`,
            top: this.state.event.clientY - itemOffsets.y,
            left: this.state.event.clientX - itemOffsets.x,
            width: this.props.dragState.itemDraggedRect?.width,
            height: this.props.dragState.itemDraggedRect?.height,
          }}
          data-testid={ids.dragAvatar}
        >
          <Card item={this.props.dragItem} isPlaying={false} />
        </div>
      );
    } else return <div></div>;
  }
}
const mapDragState = (state: RootState) => ({
  dragState: state.dragState,
  dragItem: state.items[state.dragState.cardDraggedId],
});
export default connect(mapDragState, allActions)(DndAvatar);
