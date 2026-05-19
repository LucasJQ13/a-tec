import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { academicTheme } from '../config/theme.config';

export function AnimatedLoadingBar() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1050,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 1050,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-96, 96],
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.indicator, { transform: [{ translateX }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: 'rgba(244, 235, 216, 0.16)',
    borderColor: 'rgba(196, 154, 90, 0.42)',
    borderRadius: 999,
    borderWidth: 1,
    height: 10,
    overflow: 'hidden',
    width: 192,
  },
  indicator: {
    backgroundColor: academicTheme.colors.bronzeLight,
    borderRadius: 999,
    height: 8,
    width: 96,
  },
});
