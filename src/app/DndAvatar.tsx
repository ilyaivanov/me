import { allActions, AllActions, RootState } from "./state";
import React from "react";
import { ids } from "./gallery/pageObject";
import { connect } from "react-redux";
import Card from "./gallery/Card";
import { cn } from "./utils";

type DndAvatarProps = AllActions & ReturnType<typeof mapDragState>;

class DndAvatar extends React.Component<DndAvatarProps> {
  state = {
    event: undefined as MouseEvent | undefined,
  };

  distance = 0;
  onMouseMove = (e: MouseEvent) => {
    const { dragState } = this.props;
    if (dragState.cardDraggedId) {
      if (!dragState.isDragging) {
        const { movementX, movementY } = e;
        this.distance += Math.sqrt(
          movementX * movementX + movementY * movementY
        );
        if (this.distance >= 5) {
          this.props.startDragging();
        }
      }
      this.setState({ event: e });
    }
  };

  onMouseUp = () => {
    this.distance = 0;
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
    if (this.props.dragState.isDragging && this.state.event && itemOffsets) {
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
