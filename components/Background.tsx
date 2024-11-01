import { StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { IPhoto } from './Photo';

const Background = ({
  item,
  index,
  scrollX,
}: {
  item: IPhoto;
  index: number;
  scrollX: SharedValue<number>;
}) => {
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollX.value,
        [index - 1, index, index + 1],
        [0, 1, 0]
      ),
    };
  });
  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, stylez]}>
      <Image
        source={{ uri: item.src.large }}
        blurRadius={5}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );
};

export default memo(Background);
