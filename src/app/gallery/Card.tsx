import React, { CSSProperties } from "react";
import { Play, Pause, Chevron, Arrow } from "../icons";
import { allActions, Item, AllActions, RootState } from "../state";
import { connect } from "react-redux";
import { getPreviewItemsForFolder, traverseAllNodes } from "../state/selectors";
import { cn } from "../utils";
import { ids } from "./pageObject";

interface OuterProps {
  item: Item;
  isPlaying?: boolean;
  width?: string;
}
type Props = OuterProps & AllActions & ReturnType<typeof mapState>;

class Card extends React.Component<Props> {
  renderItemPreview = () => {
    if (
      this.props.folderFirstItems.length === 0 &&
      this.props.item.itemType === "folder"
    )
      return this.renderEmpty();
    else return this.renderFolderImage();
  };
  renderFolderImage = () => (
    <div className="card-preview-dimensions" data-testid={ids.folderPreview}>
      <div className="overlay folder-preview-container">
        {this.props.item.itemType === "folder" ? (
          <>
            <div className="left">
              <img
                src={this.props.folderFirstItems[0].image}
                alt="preview-image"
                draggable={false}
              />
            </div>
            <div className="right">
              {this.props.folderFirstItems.slice(1, 5).map((item) => (
                <img
                  key={item.id}
                  src={item.image}
                  alt="preview-image"
                  draggable={false}
                />
              ))}
            </div>
          </>
        ) : (
          <img src={this.props.item.image} alt="" draggable={false} />
        )}
      </div>
      <div className="overlay flex-center">
        {this.props.isPlaying ? (
          <Pause className="icon pause-icon" />
        ) : (
          <Play
            data-testid={ids.playIcon}
            onClick={this.onPlayClick}
            className="icon"
          />
        )}
      </div>
    </div>
  );
  renderEmpty = () => (
    <div className="card-preview-dimensions">
      <div className="overlay flex-center empty-folder">Empty</div>
    </div>
  );

  onPlayClick = () => {
    const { item } = this.props;
    this.props.playItem(item.id);
  };

  onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const itemOffsets = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    this.props.onMouseDownForCard(this.props.item.id, rect, itemOffsets);
  };

  onMouseEnter = () => {
    if (
      this.props.dragState.cardDraggedId &&
      this.props.item.id !== this.props.dragState.cardDraggedId
    ) {
      this.props.setCardDestination(this.props.item.id, "gallery");
    }
  };
  onMouseLeave = () => {
    if (
      this.props.dragState.cardDraggedId &&
      this.props.item.id !== this.props.dragState.cardDraggedId
    ) {
      this.props.setCardDestination("", undefined);
    }
  };

  renderChildTrack = (item: Item) => {
    let image;
    let videoCount;
    if (item.itemType === "folder") {
      const allSubvideos = traverseAllNodes(
        this.props.items,
        item.id,
        (item) => item
      ).filter((item) => item.itemType === "video");
      videoCount = allSubvideos.length;
      if (allSubvideos.length > 0) {
        image = allSubvideos[0].image;
      }
    } else {
      image = item.image;
    }
    return (
      <div className={"subtrack"}>
        <Play
          onClick={() => this.props.playItem(item.id)}
          className="subtrack-play-icon"
        />
        <img src={image} alt="" />
        {item.title}
        {item.itemType == "folder" && (
          <div className="stubtrack-items-count">{videoCount}</div>
        )}
        {item.itemType === "folder" && (
          <Arrow
            title={"Fooo"}
            onClick={() => this.props.focusNode(item.id)}
            className={"icon subtrack-arrow-icon"}
          />
        )}
      </div>
    );
  };

  render() {
    let { item, dragState } = this.props;
    return (
      <div
        className={cn({
          card: true,
          "open-card": this.props.item.isOpenInGallery,
          "card-drag-destination":
            dragState.dragArea === "gallery" &&
            item.id == dragState.cardUnderId,
          "card-being-dragged":
            dragState.isDragging && item.id == dragState.cardDraggedId,
        })}
        data-testid={ids.card(item.id)}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={{
          width: this.props.width,
        }}
      >
        {this.renderItemPreview()}

        <div data-testid={ids.cardTitle} className="text-container">
          {item.title}
        </div>

        <div
          className={cn({
            "subtracks-container": true,
            "subtracks-container-closed": !this.props.item.isOpenInGallery,
          })}
        >
          {this.props.childItems.map(this.renderChildTrack)}
        </div>

        {item.itemType === "folder" && (
          <Chevron
            onClick={() => {
              this.props.changeNode(this.props.item.id, {
                isOpenInGallery: !this.props.item.isOpenInGallery,
              });
            }}
            className={cn({
              "icon expand-icon": true,
              rotated: this.props.item.isOpenInGallery,
            })}
          />
        )}
        {item.itemType === "folder" && (
          <Arrow
            onClick={() => this.props.focusNode(this.props.item.id)}
            className={"icon card-arrow-icon"}
          />
        )}
      </div>
    );
  }
}
const mapState = (state: RootState, props: OuterProps) => {
  const folderFirstItems =
    props.item.itemType === "folder"
      ? getPreviewItemsForFolder(state.items, props.item.id)
      : [];
  return {
    folderFirstItems,
    dragState: state.dragState,
    childItems: props.item.children.map((id) => state.items[id]),
    items: state.items,
  };
};
export default connect(mapState, allActions)(Card);
