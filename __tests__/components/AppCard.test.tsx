import React from "react";
import { Text, View } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import AppCard from "../../components/Card/AppCard";

jest.mock("../../components/Animated", () => {
  const React = require("react");
  const { Pressable } = require("react-native");

  return {
    Interactive: ({ children, ...props }: any) => (
      <Pressable accessibilityRole="button" {...props}>
        {children}
      </Pressable>
    ),
  };
});

describe("AppCard", () => {
  it("renders its children", () => {
    const { getByText } = render(
      <AppCard>
        <Text>Card content</Text>
      </AppCard>,
    );

    expect(getByText("Card content")).toBeTruthy();
  });

  it("renders as a non-interactive View when onPress is not provided", () => {
    const { UNSAFE_getByType, queryByRole } = render(
      <AppCard>Card content</AppCard>,
    );

    expect(UNSAFE_getByType(View)).toBeTruthy();
    expect(queryByRole("button")).toBeNull();
  });

  it("renders an interactive card when onPress is provided", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <AppCard onPress={onPress}>Tap card</AppCard>,
    );

    fireEvent.press(getByRole("button"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not trigger onPress when disabled", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <AppCard onPress={onPress} disabled>
        Disabled card
      </AppCard>,
    );

    fireEvent.press(getByRole("button"));

    expect(onPress).not.toHaveBeenCalled();
  });

  it("accepts the outlined and elevated variants", () => {
    const { getByText, rerender } = render(
      <AppCard variant="outlined"><Text>Outlined card</Text></AppCard>,
    );

    expect(getByText("Outlined card")).toBeTruthy();

    rerender(<AppCard variant="elevated"><Text>Elevated card</Text></AppCard>);

    expect(getByText("Elevated card")).toBeTruthy();
  });

  it("applies the requested padding", () => {
    const { UNSAFE_getByType } = render(
      <AppCard padding={24}>Padded card</AppCard>,
    );

    const card = UNSAFE_getByType(View);
    expect(card.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ padding: 24 })]),
    );
  });

  it("forwards a custom style", () => {
    const customStyle = { marginTop: 12 };
    const { UNSAFE_getByType } = render(
      <AppCard style={customStyle}>Styled card</AppCard>,
    );

    const card = UNSAFE_getByType(View);
    expect(card.props.style).toEqual(
      expect.arrayContaining([customStyle]),
    );
  });
});
