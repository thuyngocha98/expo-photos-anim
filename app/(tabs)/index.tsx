import Background from '@/components/Background';
import PhotoCom, {
  _imageHeight,
  _imageWidth,
  IPhoto,
} from '@/components/Photo';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

const _spacing = 20;

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const scroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x / (_imageWidth + _spacing);
  });

  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: ['photos'],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await fetch(
          `https://api.pexels.com/v1/search?query=mobile&orientation=portrait&page=${pageParam}&per_page=10`,
          {
            headers: {
              Authorization:
                '91VHzDYf7PtUvcHHoX6UR1Dl7Pi25YRSKkbii6LOVoYo1lTeORvyoWVO',
            },
          }
        );
        const photos = (await res.json()) as { photos: IPhoto[] };
        return photos;
      },
      getNextPageParam: (lastPage, _, lastPageParam) => {
        if (lastPage.photos.length < 10) {
          return undefined;
        }
        return lastPageParam + 1;
      },
    });

  // const { data, isLoading } = useQuery<{ photos: Photo[] }>({
  //   queryKey: ['photos', page],
  //   queryFn: async () => {
  //     const res = await fetch(
  //       `https://api.pexels.com/v1/search?query=mobile&orientation=portrait&page=${page}&per_page=10`,
  //       {
  //         headers: {
  //           Authorization:
  //             '91VHzDYf7PtUvcHHoX6UR1Dl7Pi25YRSKkbii6LOVoYo1lTeORvyoWVO',
  //         },
  //       }
  //     );
  //     return res.json();
  //   },
  // });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View
        style={{
          width: _imageWidth,
          height: _imageHeight,
          overflow: 'hidden',
          borderRadius: 10,
          boxShadow: '0 5px 10px rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={StyleSheet.absoluteFillObject}>
        {(data?.pages.flatMap((page) => page.photos) ?? []).map(
          (item, index) => (
            <Background
              key={index}
              item={item}
              index={index}
              scrollX={scrollX}
            />
          )
        )}
      </View>
      <Animated.FlatList
        horizontal
        style={{ flexGrow: 0 }}
        scrollEventThrottle={1000 / 60}
        data={data?.pages.flatMap((page) => page.photos) ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <PhotoCom item={item} index={index} scrollX={scrollX} />
        )}
        contentContainerStyle={{
          gap: _spacing,
          padding: (width - _imageWidth) / 2,
        }}
        snapToInterval={_imageWidth + _spacing}
        decelerationRate={'normal'}
        onScroll={scroll}
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={3}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}
