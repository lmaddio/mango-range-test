import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Range } from "./Range";
import { DOT_ID } from "./DotRange";

// For simplicity the mocked values have a scale of 1
const BAR_PROPERTIES = {
  LEFT: 0,
  RIGHT: 200,
  WIDTH: 200
};
const MIN_MOCK_VALUE = 0;
const MAX_MOCK_VALUE = 300;

global.mockGetBoundingClientRect({
  left: BAR_PROPERTIES.LEFT,
  right: BAR_PROPERTIES.RIGHT,
  width: BAR_PROPERTIES.WIDTH
});

jest.mock("./BarRange/BarLabel/EditableComponent");

const originalConsoleError = console.error;

// Remove logs from console to get a cleaner output
jest.spyOn(console, 'error').mockImplementation((msg) => {
  if (msg.includes("field without an `onChange`")) {
    return ;
  }

  originalConsoleError(msg);
});

afterEach(cleanup);

test("Should change label when dot position change", async () => {
  render(
    <Range
      min={MIN_MOCK_VALUE}
      max={MAX_MOCK_VALUE}
      isEditable
      isDraggable
    />
  );

  let minLabel = await screen.getByDisplayValue(getLabel(MIN_MOCK_VALUE));
  expect(minLabel).toBeInTheDocument();

  let maxLabel = await screen.getByDisplayValue(getLabel(MAX_MOCK_VALUE));
  expect(maxLabel).toBeInTheDocument();

  // Check left dot
  const mouseDown = window.getMouseEvent('mousedown');
  const mouseUp = window.getMouseEvent('mouseup');
  let mouseMove = window.getMouseEvent('mousemove', {
    clientX: global.getMousePositionForDotValue(100)
  });

  const [leftBarDotNode, rightBarDotNode] = screen.getAllByTestId(DOT_ID);

  fireEvent(leftBarDotNode, mouseDown);
  fireEvent(leftBarDotNode, mouseMove);
  fireEvent(leftBarDotNode, mouseUp);

  minLabel = await screen.getByDisplayValue(global.getLabel(100));
  expect(minLabel).toBeInTheDocument();

  // Check right dot
  mouseMove = global.getMouseEvent('mousemove', {
    clientX: global.getMousePositionForDotValue(200)
  });
  fireEvent(rightBarDotNode, mouseDown);
  fireEvent(rightBarDotNode, mouseMove);
  fireEvent(rightBarDotNode, mouseUp);

  maxLabel = await screen.getByDisplayValue(global.getLabel(200));
  expect(maxLabel).toBeInTheDocument();
});
