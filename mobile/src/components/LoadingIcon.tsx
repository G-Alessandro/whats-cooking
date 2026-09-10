import { useEffect, useRef } from "react";
import { Animated, View, Easing } from "react-native";
import LoadingSvg from "../assets/svg/loading/loading.svg";

type LoadingIconProps = {
  width: number;
  height: number;
};

export default function LoadingIcon({ width, height }: LoadingIconProps) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      style={{
        height,
        width,
      }}
    >
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <LoadingSvg />
      </Animated.View>
    </View>
  );
}
