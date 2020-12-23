import React from "react";
import { Play, Pause, Chevron, Arrow, Search } from "../icons";
import { connect } from "react-redux";
import { cn } from "../";
import { gallery as ids } from "../testId";
import { actions, selectors } from "../../domain";

interface OuterProps {
  item: Item;
  isPlaying?: boolean;
}
type Props = OuterProps & ReturnType<typeof mapState>;

class Card extends React.Component<Props> {
  renderItemPreview = () => {
    if (
      this.props.folderFirstItems.length === 0 &&
      this.props.item.itemType === "folder" &&
      !this.props.item.youtubePlaylistId
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
                src={this.props.item.image || selectors.getVideoImage(this.props.folderFirstItems[0])}
                alt="preview"
                draggable={false}
              />
            </div>
            <div className="right">
              {this.props.folderFirstItems.slice(1, 5).map((item) => (
                <img
                  key={item.id}
                  src={selectors.getVideoImage(item)}
                  alt="preview"
                  draggable={false}
                />
              ))}
            </div>
          </>
        ) : (
          <img
            src={selectors.getVideoImage(this.props.item)}
            alt=""
            draggable={false}
          />
        )}
      </div>
      <div className="overlay flex-center">
        {this.props.isPlaying ? (
          <Pause className="icon play-card-icon" />
        ) : (
          <Play
            data-testid={ids.playIcon}
            onClick={this.onPlayClick}
            className="icon play-card-icon"
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
    actions.playItem(item.id);
  };

  onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const itemOffsets = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (this.props.item.isOpenInGallery) {
      //if Card is open I want to extract height of the image, which is closed by overflow
      itemOffsets.y -= rect.width * 0.5625;
    }
    actions.mouseDown(this.props.item.id, {
      elementRect: rect,
      itemOffsets,
      dragAvatarType: "big",
    });
  };

  onMouseEnter = () => {
    if (
      this.props.dragState.cardDraggedId &&
      this.props.item.id !== this.props.dragState.cardDraggedId
    ) {
      actions.setCardDestination(this.props.item.id, "gallery");
      actions.setCardDragAvatarType("big");
    }
  };
  onMouseLeave = () => {
    if (
      this.props.dragState.cardDraggedId &&
      this.props.item.id !== this.props.dragState.cardDraggedId
    ) {
      actions.setCardDestination("", undefined);
    }
  };

  onSubtrackMouseEnter = (item: Item) => {
    if (
      this.props.dragState.cardDraggedId &&
      this.props.dragState.cardDraggedId !== this.props.item.id &&
      item.id !== this.props.dragState.cardDraggedId
    ) {
      actions.setCardDestination(item.id, "gallery");
      actions.setCardDragAvatarType("small");
    }
  };

  onSubtrackMouseLeave = (item: Item) => {
    if (
      this.props.dragState.cardDraggedId &&
      item.id !== this.props.dragState.cardDraggedId
    ) {
      actions.setCardDestination("", undefined);
    }
  };

  onSubtrackMouseDown = (item: Item) => {
    //Same as Sidebar handler
    actions.mouseDown(item.id, {
      dragAvatarType: "small",
      itemOffsets: {
        x: 100,
        y: 100,
      },
      elementRect: { width: 200 } as any,
    });
  };

  renderChildTrack = (item: Item) => {
    let image;
    let videoCount;
    if (item.itemType === "folder") {
      image = selectors.getFirstVideoImage(this.props.items, item.id);
      if (!image) image = item.image;
    } else {
      image = selectors.getVideoImage(item);
    }
    return (
      <div
        className={cn({
          subtrack: true,
          "subtrack-drag-destination":
            this.props.dragState.cardUnderId === item.id,
          "subtrack-being-dragged":
            this.props.dragState.isDragging &&
            this.props.dragState.cardDraggedId === item.id,
        })}
        data-testid={ids.subtrack(item.id)}
        key={item.id}
        onMouseEnter={() => this.onSubtrackMouseEnter(item)}
        onMouseLeave={() => this.onSubtrackMouseLeave(item)}
        onMouseDown={() => this.onSubtrackMouseDown(item)}
      >
        <Play
          onClick={() => actions.playItem(item.id)}
          className="icon subtrack-play-icon"
        />
        <img src={image} alt="" />
        <span data-testid={ids.subtrackText}>{item.title}</span>
        {item.itemType === "folder" && (
          <div className="stubtrack-items-count">{videoCount}</div>
        )}
        {item.itemType === "folder" && (
          <Arrow
            title={"Fooo"}
            onClick={() => actions.focusNode(item.id)}
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
            item.id === dragState.cardUnderId,
          "card-being-dragged":
            dragState.isDragging && item.id === dragState.cardDraggedId,
        })}
        data-testid={ids.card(item.id)}
      >
        <div
          data-testid={ids.cardDragDropArea}
          onMouseDown={this.onMouseDown}
          onMouseLeave={this.onMouseLeave}
          onMouseEnter={this.onMouseEnter}
        >
          {this.renderItemPreview()}

          <div data-testid={ids.cardTitle} className="text-container">
            {item.title}
            <div className="card-type">
              {item.youtubePlaylistId ? "playlist" : item.itemType}
            </div>
            {this.props.item.channelTitle && (
              <div className="card_channel-title">
                {this.props.item.channelTitle}
              </div>
            )}
          </div>
        </div>
        <div
          className={cn({
            "subtracks-container": true,
            "subtracks-container-closed": !this.props.item.isOpenInGallery,
          })}
          onScroll={(e) => actions.onSubtracksScroll(e, item)}
        >
          {this.props.childItems.map(this.renderChildTrack)}
          {(item.youtubePlaylistNextPageId || item.isLoadingYoutubePlaylist) &&
            this.renderSubtracksLoadingIndicator()}
        </div>

        {item.itemType !== "video" && (
          <Chevron
            data-testid={ids.expandCard}
            onClick={() => {
              actions.changeItem(item.id, {
                isOpenInGallery: !item.isOpenInGallery,
              });

              actions.loadYoutubePlaylist(item);
            }}
            className={cn({
              "icon expand-icon": true,
              rotated: this.props.item.isOpenInGallery,
            })}
          />
        )}
        {item.itemType !== "video" && (
          <Arrow
            onClick={() => actions.focusNode(this.props.item.id)}
            className={"icon card-arrow-icon"}
          />
        )}
        {item.itemType === "video" && (
          <Search
            onClick={() => actions.findSimilarVideos(this.props.item.id)}
            className={"icon card-arrow-icon"}
          />
        )}
      </div>
    );
  }
  renderSubtracksLoadingIndicator(): React.ReactNode {
    return (
      <div
        className="subtracks-loading-container overlay flex-center"
        data-testid={ids.cardLoadingIndicator}
      >
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
}
const mapState = (state: MyState, props: OuterProps) => {
  const folderFirstItems =
    props.item.itemType === "folder"
      ? selectors.getPreviewItemsForFolder(state.items, props.item.id)
      : [];
  return {
    folderFirstItems,
    dragState: state.dragState,
    childItems: props.item.children.map((id) => state.items[id]),
    items: state.items,
  };
};
export default connect(mapState)(Card);
