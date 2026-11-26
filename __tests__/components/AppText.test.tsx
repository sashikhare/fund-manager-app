import React from "react";
import { StyleSheet, Text as RNText } from "react-native";
import { render } from "@testing-library/react-native";

import AppText from "../../components/Text/AppText";
import { Colors, Typography } from "../../theme";

describe("AppText", () => {
  it("renders its children", () => {
    const { getByText } = render(<AppText>Hello world</AppText>);

    expect(getByText("Hello world")).toBeTruthy();
  });

  it("uses the body variant by default", () => {
    const { getByText } = render(<AppText>Default typography</AppText>);
    const text = getByText("Default typography");
    const flattenedStyle = StyleSheet.flatten(text.props.style);

    expect(flattenedStyle.fontSize).toBe(Typography.body.fontSize);
    expect(flattenedStyle.lineHeight).toBe(Typography.body.lineHeight);
  });

  it("applies the requested typography variant", () => {
    const { getByText } = render(
      <AppText variant="h2">Section heading</AppText>,
    );
    const flattenedStyle = StyleSheet.flatten(
      getByText("Section heading").props.style,
    );

    expect(flattenedStyle.fontSize).toBe(Typography.h2.fontSize);
    expect(flattenedStyle.fontWeight).toBe(Typography.h2.fontWeight);
  });

  it("uses the default text color and left alignment", () => {
    const { getByText } = render(<AppText>Default appearance</AppText>);
    const flattenedStyle = StyleSheet.flatten(
      getByText("Default appearance").props.style,
    );

    expect(flattenedStyle.color).toBe(Colors.text);
    expect(flattenedStyle.textAlign).toBe("left");
  });

  it("applies a custom color and alignment", () => {
    const { getByText } = render(
      <AppText color="#123456" align="center">
        Centered text
      </AppText>,
    );
    const flattenedStyle = StyleSheet.flatten(
      getByText("Centered text").props.style,
    );

    expect(flattenedStyle.color).toBe("#123456");
    expect(flattenedStyle.textAlign).toBe("center");
  });

  it("passes numberOfLines to the native Text component", () => {
    const { getByText } = render(
      <AppText numberOfLines={2}>Long content</AppText>,
    );

    expect(getByText("Long content").props.numberOfLines).toBe(2);
  });

  it("applies a custom font weight", () => {
    const { getByText } = render(
      <AppText weight="700">Bold text</AppText>,
    );
    const flattenedStyle = StyleSheet.flatten(
      getByText("Bold text").props.style,
    );

    expect(flattenedStyle.fontWeight).toBe("700");
  });

  it("merges a custom style with the component styles", () => {
    const customStyle = { letterSpacing: 2, marginTop: 8 };
    const { getByText } = render(
      <AppText style={customStyle}>Styled text</AppText>,
    );
    const flattenedStyle = StyleSheet.flatten(
      getByText("Styled text").props.style,
    );

    expect(flattenedStyle.letterSpacing).toBe(2);
    expect(flattenedStyle.marginTop).toBe(8);
    expect(flattenedStyle.color).toBe(Colors.text);
  });
});
