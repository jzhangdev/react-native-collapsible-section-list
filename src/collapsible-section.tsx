import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View, ViewProps } from 'react-native';
import { SectionItemT } from './types';

export interface ICollapsibleSectionProps<T extends SectionItemT> {
  item: T;
  renderSectionHeader: (item: T) => JSX.Element;
  renderSectionContent: (data: T['data']) => JSX.Element | Array<JSX.Element>;
  sectionStyle?: ViewProps['style'];
}

export function CollapsibleSection<T extends SectionItemT>({
  item,
  renderSectionHeader,
  renderSectionContent,
  sectionStyle,
}: ICollapsibleSectionProps<T>) {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const isAnimating = useRef<boolean>(false);
  const contentMeasuredHeight = useRef<number>(0);
  const contentAnimatedHeight = useRef(new Animated.Value(0));

  const openWithAnimation = (toValue: number, onFinished: () => void) => {
    Animated.spring(contentAnimatedHeight.current, {
      toValue,
      mass: 0.1,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        onFinished();
      }
    });
  };

  const closeWithAnimation = (onFinished: () => void) => {
    Animated.spring(contentAnimatedHeight.current, {
      toValue: 0,
      mass: 0.1,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        onFinished();
      }
    });
  };

  const toggleExpanded = () => {
    if (isAnimating.current) {
      return;
    }
    isAnimating.current = true;

    if (!isOpened) {
      openWithAnimation(contentMeasuredHeight.current, () => {
        setIsOpened(true);
        isAnimating.current = false;
      });
    } else {
      closeWithAnimation(() => {
        setIsOpened(false);
        isAnimating.current = false;
      });
    }
  };

  const content = (
    <View
      onLayout={({ nativeEvent: { layout } }) => {
        if (isAnimating.current || layout.height === 0) {
          return;
        }
        if (isOpened) {
          contentMeasuredHeight.current = layout.height;
          openWithAnimation(layout.height, () => {
            isAnimating.current = false;
          });
        } else {
          contentMeasuredHeight.current = layout.height;
        }
      }}>
      {renderSectionContent(item.data)}
    </View>
  );

  return (
    <View style={sectionStyle}>
      <Pressable onPress={toggleExpanded}>
        {renderSectionHeader(item)}
      </Pressable>
      <Animated.View
        style={{
          height: contentAnimatedHeight.current,
        }}>
        {content}
      </Animated.View>
      <View style={styles.offscreenContentView}>{content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  offscreenContentView: {
    position: 'absolute',
    left: 9999,
    opacity: 0,
  },
});
