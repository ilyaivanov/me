import React from "react";
import { connect } from "react-redux";
import { actions } from "../state";
import { gallery as ids } from "../testId";
import Card from "../gallery/Card";
import "./dnd.css";

type Props = ReturnType<typeof mapDragState>;

class DndAvatar extends React.Component<Props> {
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
          actions.startDragging();
        }
      }
      this.setState({ event: e });
    }
  };

  onMouseUp = () => {
    this.distance = 0;
    actions.mouseUp();
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
      if (this.props.dragState.dragAvatarType === "small") {
        return (
          <div
            className="drag-avatar drag-avatar-mini text-container "
            style={{
              transformOrigin: `${itemOffsets.x}px ${itemOffsets.y}px`,
              top: this.state.event.clientY,
              left: this.state.event.clientX,
              maxWidth: this.props.dragState.itemDraggedRect?.width,
            }}
          >
            {this.props.dragItem.title}
          </div>
        );
      } else {
        return (
          <div
            className="drag-avatar"
            style={{
              transformOrigin: `${itemOffsets.x}px ${itemOffsets.y}px`,
              top: this.state.event.clientY - itemOffsets.y,
              left: this.state.event.clientX - itemOffsets.x,
              width: this.props.dragState.itemDraggedRect?.width,
            }}
            data-testid={ids.dragAvatar}
          >
            <Card item={this.props.dragItem} isPlaying={false} />
          </div>
        );
      }
    } else return <div></div>;
  }
}
const mapDragState = (state: MyState) => ({
  dragState: state.dragState,
  dragItem: state.items[state.dragState.cardDraggedId],
});
export default connect(mapDragState)(DndAvatar);
