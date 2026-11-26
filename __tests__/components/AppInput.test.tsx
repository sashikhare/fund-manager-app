import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import AppInput from "../../components/Input/AppInput";

jest.mock("../../components/Icon/AppIcon", () => {
  const React = require("react");
  const { Text: RNText } = require("react-native");

  return function MockAppIcon({ name }: { name: string }) {
    return <RNText testID={`icon-${name}`}>{name}</RNText>;
  };
});

describe("AppInput", () => {
  it("renders a text input and forwards native input props", () => {
    const { getByPlaceholderText } = render(
      <AppInput placeholder="Enter your name" testID="name-input" />,
    );

    expect(getByPlaceholderText("Enter your name")).toBeTruthy();
  });

  it("renders the label and required indicator", () => {
    const { getByText } = render(
      <AppInput label="Email" required placeholder="Email address" />,
    );
    expect(getByText(/Email/)).toBeTruthy();
    expect(getByText(/\\*/)).toBeTruthy();
  });

  it("renders the optional label when optional is true", () => {
    const { getByText } = render(
      <AppInput label="Phone number" optional />,
    );

    expect(getByText("(Optional)")).toBeTruthy();
  });

  it("shows the error message instead of helper text", () => {
    const { getByText, queryByText } = render(
      <AppInput
        error="Invalid email"
        helperText="We will never share your email"
      />,
    );

    expect(getByText("Invalid email")).toBeTruthy();
    expect(queryByText("We will never share your email")).toBeNull();
  });

  it("shows helper text when there is no error", () => {
    const { getByText } = render(
      <AppInput helperText="Enter the email linked to your account" />,
    );

    expect(
      getByText("Enter the email linked to your account"),
    ).toBeTruthy();
  });

  it("renders left and right icons", () => {
    const { getByTestId } = render(
      <AppInput leftIcon="mail-outline" rightIcon="checkmark" />,
    );

    expect(getByTestId("icon-mail-outline")).toBeTruthy();
    expect(getByTestId("icon-checkmark")).toBeTruthy();
  });

  it("toggles password visibility when the visibility icon is pressed", () => {
    const { getByTestId, getByPlaceholderText } = render(
      <AppInput password placeholder="Password" />,
    );
    const input = getByPlaceholderText("Password");

    expect(input.props.secureTextEntry).toBe(true);
    fireEvent.press(getByTestId("icon-eye-off-outline").parent);
    expect(input.props.secureTextEntry).toBe(false);
    expect(getByTestId("icon-eye-outline")).toBeTruthy();
  });

  it("forwards focus and blur callbacks", () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { getByPlaceholderText } = render(
      <AppInput
        placeholder="Focus me"
        onFocus={onFocus}
        onBlur={onBlur}
      />,
    );
    const input = getByPlaceholderText("Focus me");

    fireEvent(input, "focus");
    fireEvent(input, "blur");

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("respects the editable prop", () => {
    const { getByPlaceholderText } = render(
      <AppInput placeholder="Read only" editable={false} />,
    );

    expect(getByPlaceholderText("Read only").props.editable).toBe(false);
  });
});
