// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import React from "react";

jest.mock("./app/player/youtubePlayer", () => ({ videoId }: any) => (
  <div data-testid={"media-explorer-player"}>{videoId}</div>
));

jest.mock("./app/api/youtubeRequest", () => ({
  findYoutubeVideos: jest.fn(),
}));

jest.mock("./app/api/firebase", () => ({
  save: jest.fn(),
  load: jest.fn(),
  auth: jest.fn(),
}));


jest.mock("./app/utils/createId", () => ({
  createId: jest.fn(),
}));