import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Alert } from "react-native";
import HomeScreen from "../(tabs)";

describe("HomeScreen", () => {
  it("renders title and subtitle", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText("Welcome!")).toBeTruthy();
    expect(getByText("Step 1: Try it")).toBeTruthy();
  });

  it("button works", () => {
    const alertMock = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    const { getByText } = render(<HomeScreen />);

    fireEvent.press(getByText("Click me"));
    expect(alertMock).toHaveBeenCalledWith("Button pressed");

    alertMock.mockRestore();
  });
});
