import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("Renders App with links", () => {
  render(<App />);
  const linksElement = screen.getAllByText(/exercise/i);

  linksElement.forEach(link => {
    expect(link).toBeInTheDocument();
  });
});
