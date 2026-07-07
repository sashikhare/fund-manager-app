import React from "react";
import {
    GestureResponderEvent,
    Pressable,
    StyleProp,
    ViewStyle,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { Animation } from "../../theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface InteractiveProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  pressedScale?: number;
}

function Interactive({
  children,
  onPress,
  disabled = false,
  style,
  pressedScale = Animation.scale.card,
}: InteractiveProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(
          pressedScale,
          Animation.spring
        );
      }}
      onPressOut={() => {
        scale.value = withSpring(
          1,
          Animation.spring
        );
      }}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

export default React.memo(Interactive);