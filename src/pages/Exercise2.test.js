import React from "react";
import { render, screen } from "@testing-library/react";
import { RangeFixed } from "./Exercise2";
import { CURRENCY } from "../components/Range/BarRange/BarLabel";

jest.mock('../services', () => ({
  fetchFixedRange: () => new Promise(resolve => setTimeout(() => resolve({
    min: 0,
    max: 100,
    values: [2, 5, 10, 50, 75]
  }), 100))
}));

const getLabel = (value) => `${value} ${CURRENCY}`;

test("Should render loading and first labels", async () => {
  render(<RangeFixed />);
  const spinner = screen.getByLabelText(/audio-loading/i);

  expect(spinner).toBeInTheDocument();

  const minLabel = await screen.findByText(getLabel(2));
  expect(minLabel).toBeInTheDocument();

  const maxLabel = await screen.findByText(getLabel(75));
  expect(maxLabel).toBeInTheDocument();
});
