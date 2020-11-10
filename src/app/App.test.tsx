import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

it('by default sidebar is open', () => {
  render(<App />);
  expect(screen.getByTestId("sidebar")).not.toHaveClass("closed");
});

it('when user clicks toggle sidebar it is closed', function () {
  render(<App />);
  fireEvent.click(screen.getByTestId("toggle-sidebar"));
  expect(screen.getByTestId("sidebar")).toHaveClass("closed");
});