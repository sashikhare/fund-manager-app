import React from "react";
import { render } from "@testing-library/react-native";

import Snackbar from "../../components/Snackbar/Snackbar";

describe("Snackbar", () => {
  it("renders nothing when not visible", () => {
    const { toJSON } = render(
      <Snackbar message="Event saved" visible={false} />,
    );

    expect(toJSON()).toBeNull();
  });

  it("renders the message when visible", () => {
    const { getByText } = render(
      <Snackbar message="Event saved" visible />,
    );

    expect(getByText("Event saved")).toBeTruthy();
  });

  it("updates the displayed message when the message changes", () => {
    const { getByText, rerender } = render(
      <Snackbar message="Event saved" visible />,
    );

    rerender(<Snackbar message="Event deleted" visible />);

    expect(getByText("Event deleted")).toBeTruthy();
  });

  it("hides the message when visibility changes to false", () => {
    const { queryByText, rerender } = render(
      <Snackbar message="Event saved" visible />,
    );

    rerender(<Snackbar message="Event saved" visible={false} />);

    expect(queryByText("Event saved")).toBeNull();
  });
});
