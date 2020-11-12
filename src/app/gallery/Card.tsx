import React from "react";
import { Play, Pause } from "../icons";
import { allActions, Item, AllActions } from "../state";
import { connect } from "react-redux";

interface Props extends AllActions {
  item: Item;
  folderFirstItems: Item[];
  isPlaying?: boolean;
}

class Card extends React.Component<Props> {
  renderFolderPreview = () => {
    if (this.props.folderFirstItems.length === 0) return this.renderEmpty();
    else return this.renderFolderImage();
  };
  renderFolderImage = () => (
    <div className="card-preview-dimensions">
      <div className="overlay folder-preview-container">
        <div className="left">
          <img src={this.props.folderFirstItems[0].image} alt="" />
        </div>
        <div className="right">
          {this.props.folderFirstItems.slice(1).map((item) => (
            <img key={item.id} src={item.image} alt="" />
          ))}
        </div>
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
    if (item.itemType === "video") this.props.playItem(item.id);
    else this.props.playItem(this.props.folderFirstItems[0].id);
  };

  onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(
      e.currentTarget.getBoundingClientRect().left,
      e.currentTarget.getBoundingClientRect().top
    );
    this.props.onMouseDownForCard(this.props.item.id);
  };

  render() {
    let { item, isPlaying } = this.props;
    return (
      <div
        className="card"
        data-testid={"card-" + item.id}
        onMouseDown={this.onMouseDown}
      >
        {item.itemType === "folder" ? (
          this.renderFolderPreview()
        ) : (
          <img src={item.image} alt="" />
        )}
        <div className="overlay gradient" />
        <div className="overlay flex-center">
          {isPlaying ? (
            <Pause className="icon pause-icon" />
          ) : (
            <Play
              data-testid={`play-icon-${item.id}`}
              onClick={this.onPlayClick}
              className="icon"
            />
          )}
        </div>
        <div className="overlay text-container">{item.title}</div>
      </div>
    );
  }
}

export default connect(undefined, allActions)(Card);
