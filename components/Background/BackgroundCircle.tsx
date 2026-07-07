import React, { useEffect } from "react";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

interface Props {
  size: number;
  color: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  opacity?: number;
  duration?: number;
  direction?: "up" | "down";
}

export default function BackgroundCircle({
  size,
  color,
  top,
  left,
  right,
  bottom,
  opacity = 0.08,
  duration = 5000,
  direction = "up",
}: Props) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(direction === "up" ? -20 : 20, {
        duration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translateY.value,
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity,
          top,
          left,
          right,
          bottom,
        },
        animatedStyle,
      ]}
    />
  );
}
