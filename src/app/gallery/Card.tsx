import React from "react";
import { Play, Pause } from "../icons";
import { Item } from "../state";

interface Props {
  item: Item;
  folderFirstItems: Item[];
  isPlaying?: boolean;
  onPlay: (itemId: string) => void;
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
    if (item.itemType === "video") this.props.onPlay(item.id);
    else this.props.onPlay(this.props.folderFirstItems[0].id);
  };

  render() {
    let { item, isPlaying } = this.props;
    return (
      <div className="card" data-testid={"card-" + item.id}>
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

export default Card;
