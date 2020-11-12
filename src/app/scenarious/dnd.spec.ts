import renderTestApp from "./renderTestApp";
import gallery from "../gallery/pageObject";

fit("having an app", function () {
  renderTestApp();
  gallery.moveMouse({ movementX: 5, movementY: 5 });
  expect(gallery.getDragAvatar()).not.toBeInTheDocument();

  gallery.mouseDownOnCard("playground1");

  //I'm now initiating drag immediatelly, user needs to drag at least 4 pixels in distance
  gallery.moveMouse({ movementX: 1, movementY: 1 });
  gallery.moveMouse({ movementX: -1, movementY: 1 });
  expect(gallery.getDragAvatar()).not.toBeInTheDocument();

  gallery.moveMouse({ movementX: 5, movementY: 5 });
  expect(gallery.getDragAvatar()).toBeInTheDocument();
  gallery.mouseUp({});
  expect(gallery.getDragAvatar()).not.toBeInTheDocument();

  const sampleBoundingRect = {
    bottom: 446.8125,
    height: 189.5625, //and this
    left: 677, //use this
    right: 1014,
    top: 257.25, //and this
    width: 337, //this
    x: 677,
    y: 257.25,
  };
  //on mouse down store set drag state to mouse down
  //when moving a few pixels store set travel distance
  //when moving quite a few pixel more store set's drag state to dragging
});
