import React from "react";
import { Play, Pause } from "../icons";
import { Item } from "../state";

interface Props {
  item: Item;
  isPlaying?: boolean;
}

const Card = ({ item, isPlaying }: Props) => (
  <div className="card" data-testid={"card-" + item.id}>
    <img src={item.image} alt="" />
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

export default Card;
