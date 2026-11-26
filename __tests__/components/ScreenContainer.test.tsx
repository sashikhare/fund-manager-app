import React from "react";
import { StatusBar, View } from "react-native";
import { render } from "@testing-library/react-native";

import ScreenContainer from "../../components/Screen/ScreenContainer";
import { Colors } from "../../theme";

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    SafeAreaView: ({ children, ...props }: any) => (
      <View testID="safe-area" {...props}>
        {children}
      </View>
    ),
  };
});

describe("ScreenContainer", () => {
  it("renders its children", () => {
    const { getByText } = render(
      <ScreenContainer>
        <View>
          <View testID="screen-content" />
        </View>
      </ScreenContainer>,
    );

    expect(getByText).toBeDefined();
  });

  it("renders the safe area wrapper and content container", () => {
    const { getByTestId } = render(
      <ScreenContainer>
        <View testID="screen-child" />
      </ScreenContainer>,
    );

    expect(getByTestId("safe-area")).toBeTruthy();
    expect(getByTestId("screen-child")).toBeTruthy();
  });

  it("configures the status bar with the app background", () => {
    const { UNSAFE_getByType } = render(
      <ScreenContainer>
        <View />
      </ScreenContainer>,
    );

    const statusBar = UNSAFE_getByType(StatusBar);

    expect(statusBar.props.barStyle).toBe("light-content");
    expect(statusBar.props.backgroundColor).toBe(Colors.background);
  });
});
