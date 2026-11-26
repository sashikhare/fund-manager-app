import React from "react";
import { ActivityIndicator, Pressable } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import AppButton from "../../components/Button/AppButton";

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

jest.mock("../../components/Icon/AppIcon", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return function MockAppIcon({ name }: { name: string }) {
    return <Text>{name}</Text>;
  };
});

describe("AppButton", () => {
  it("renders the supplied title", () => {
    const { getByText } = render(<AppButton title="Save changes" />);

    expect(getByText("Save changes")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <AppButton title="Continue" onPress={onPress} />,
    );

    fireEvent.press(getByRole("button"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <AppButton title="Continue" onPress={onPress} disabled />,
    );

    fireEvent.press(getByRole("button"));

    expect(onPress).not.toHaveBeenCalled();
  });

  it("shows a loading indicator instead of the title while loading", () => {
    const { queryByText, UNSAFE_getByType } = render(
      <AppButton title="Saving" loading />,
    );

    expect(queryByText("Saving")).toBeNull();
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it("disables the button while loading", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <AppButton title="Saving" onPress={onPress} loading />,
    );

    fireEvent.press(getByRole("button"));

    expect(onPress).not.toHaveBeenCalled();
  });

  it("renders optional left and right icons", () => {
    const { getByText } = render(
      <AppButton title="Add member" leftIcon="person-add" rightIcon="arrow-forward" />,
    );

    expect(getByText("person-add")).toBeTruthy();
    expect(getByText("arrow-forward")).toBeTruthy();
  });

  it("renders with the provided variant, size, and custom width setting", () => {
    const { getByText } = render(
      <AppButton
        title="Delete"
        variant="danger"
        size="small"
        fullWidth={false}
      />,
    );

    expect(getByText("Delete")).toBeTruthy();
  });

  it("renders the provided custom text", () => {
    const { getByText } = render(
      <AppButton title="Custom label" textStyle={{ letterSpacing: 1 }} />,
    );

    expect(getByText("Custom label")).toBeTruthy();
  });
});
