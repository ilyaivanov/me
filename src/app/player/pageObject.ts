import { screen } from "@testing-library/react";

// prettier-ignore
class Player {
  getVideoIdBeingPlayed = () =>{
    return screen.getByTestId("media-explorer-player").innerHTML;
  }
}

export default new Player();
