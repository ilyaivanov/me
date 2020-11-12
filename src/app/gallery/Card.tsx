import React from "react";
import { Play, Pause } from "../icons";
import { Item } from "../state";

interface Props {
  item: Item;
  previewImages: string[];
  isPlaying?: boolean;
}

class Card extends React.Component<Props> {
  renderFolderPreview = () => {
    console.log(this.props.previewImages);
    if (this.props.previewImages.length === 0) return this.renderEmpty();
    else return this.renderFolderImage();
  };
  renderFolderImage = () => (
    <div className="card-preview-dimensions">
      <div className="overlay folder-preview-container">
        <div className="left">
          <img src={this.props.previewImages[0]} alt="" />
        </div>
        <div className="right">
          {this.props.previewImages.slice(1).map((image) => (
            <img key={image} src={image} alt="" />
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
            <Play className="icon" />
          )}
        </div>
        <div className="overlay text-container">{item.title}</div>
      </div>
    );
  }
}

export default Card;
