import { Ionicons } from '@expo/vector-icons';
import theme from 'lib/theme';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';
import { useFlashcardStore } from 'stores/translation-store';

export type AnimatedIconProps = {
  name: string;
  size?: number;
  color?: string;
  spinning?: boolean;
  style?: StyleProp<ViewStyle>;
};

export interface AnimatedIconRef {
  start: () => void;
  stop: () => void;
}

export const AnimatedIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
  ({ name, size = 24, color, spinning = false, style }, ref) => {
    const { theme: selectedTheme } = useFlashcardStore(state => state);
    const spinAnim = useRef(new Animated.Value(0)).current;
    const animation = useRef<Animated.CompositeAnimation | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        start: () => {
          if (!animation.current) {
            animation.current = Animated.loop(
              Animated.timing(spinAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
              }),
            );
          }
          animation.current.start();
        },
        stop: () => {
          animation.current?.stop();
          spinAnim.setValue(0);
        },
      }),
      [spinAnim],
    );

    useEffect(() => {
      if (spinning) {
        if (!animation.current) {
          animation.current = Animated.loop(
            Animated.timing(spinAnim, {
              toValue: 1,
              duration: 1000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          );
        }
        animation.current.start();
      } else {
        animation.current?.stop();
        // Reset rotation to 0deg smoothly
        Animated.timing(spinAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();
      }
    }, [spinning, spinAnim]);

    const spin = spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View style={[{ transform: [{ rotate: spin }] }, style]}>
        <Ionicons
          name={name as any}
          size={size}
          color={color ?? theme[selectedTheme].background}
        />
      </Animated.View>
    );
  },
);
