// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import React from "react";

jest.mock("./ui/player/youtubePlayer", () => ({ videoId }: any) => (
  <div data-testid={"mocked-youtube-player"}>{videoId}</div>
));

jest.mock("./api/youtubeRequest", () => ({
  findYoutubeVideos: jest.fn(),
  fetchPlaylistVideos: jest.fn(),
  findSimilarYoutubeVideos: jest.fn(),
}));

jest.mock("./api/firebase", () => ({
  save: jest.fn(),
  load: jest.fn(),
  auth: jest.fn(),
}));

jest.mock("./domain/createId", () => ({
  createId: jest.fn(),
}));

// @ts-expect-error
// eslint-disable-next-line no-native-reassign
fetch = jest.fn();
