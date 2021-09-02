import React from "react";
import { render, screen } from "@testing-library/react";
import { RangeMinMax } from "./Exercise1";
import { DOT_ID } from "../components/Range/DotRange";

// For simplicity the mocked values have a scale of 1
const BAR_PROPERTIES = {
  LEFT: 0,
  RIGHT: 200,
  WIDTH: 200
};
const MIN_MOCK_VALUE = 0;
const MAX_MOCK_VALUE = 300;

jest.mock("../services", () => ({
  fetchMinMaxRange: () => new Promise(resolve => setTimeout(() => resolve({
    min: MIN_MOCK_VALUE,
    max: MAX_MOCK_VALUE
  }), 50))
}));


global.mockGetBoundingClientRect({
  left: BAR_PROPERTIES.LEFT,
  right: BAR_PROPERTIES.RIGHT,
  width: BAR_PROPERTIES.WIDTH
});

test("Should start rendering loading and later 2 labels and 2 dots with the min and max value", async () => {
  render(<RangeMinMax />);
  const spinner = screen.getByLabelText(/audio-loading/i);

  expect(spinner).toBeInTheDocument();

  const minLabel = await screen.findByText(getLabel(MIN_MOCK_VALUE));
  expect(minLabel).toBeInTheDocument();

  const maxLabel = await screen.findByText(getLabel(MAX_MOCK_VALUE));
  expect(maxLabel).toBeInTheDocument();

  const [leftBarDotNode, rightBarDotNode, ...restNodes] = screen.getAllByTestId(DOT_ID);

  expect(restNodes).toEqual([]);
  expect(leftBarDotNode).toBeInTheDocument();
  expect(rightBarDotNode).toBeInTheDocument();
});
