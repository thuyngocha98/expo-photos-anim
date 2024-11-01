import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Image } from 'expo-image';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const { width } = Dimensions.get('screen');
export const _imageWidth = width * 0.7;
export const _imageHeight = _imageWidth * 1.5;

export interface IPhoto {
  id: number;
  src: {
    large: string;
  };
}

const Photo = ({
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
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [1.4, 1, 1.4]
          ),
        },
        {
          rotate: `${interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [8, 0, -8]
          )}deg`,
        },
      ],
    };
  });
  return (
    <View
      style={{
        width: _imageWidth,
        height: _imageHeight,
        overflow: 'hidden',
        borderRadius: 10,
        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.5)',
      }}
    >
      <AnimatedImage
        source={{ uri: item.src.large }}
        style={[{ flex: 1 }, stylez]}
      />
    </View>
  );
};

export default memo(Photo);
