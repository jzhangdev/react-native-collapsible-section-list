import { useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
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
  const [isMeasured, setIsMeasured] = useState<boolean>(false);
  const isAnimating = useRef<boolean>(false);
  const contentMeasuredHeight = useRef<number>(0);
  const contentAnimatedHeight = useRef(new Animated.Value(0));

  const toggleExpanded = () => {
    if (isAnimating.current) {
      return;
    }
    isAnimating.current = true;
    if (!isOpened) {
      Animated.spring(contentAnimatedHeight.current, {
        toValue: contentMeasuredHeight.current,
        mass: 0.1,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          setIsOpened(true);
          isAnimating.current = false;
        }
      });
    } else {
      Animated.spring(contentAnimatedHeight.current, {
        toValue: 0,
        mass: 0.1,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          setIsOpened(false);
          isAnimating.current = false;
        }
      });
    }
  };

  const onContentViewLayout = ({
    nativeEvent: { layout },
  }: LayoutChangeEvent) => {
    if (!isMeasured) {
      contentMeasuredHeight.current = layout.height;
      setIsMeasured(true);
    }
  };

  const contentViewStyles = StyleSheet.flatten([
    isMeasured
      ? {
          height: contentAnimatedHeight.current,
        }
      : styles.collapsibleSectionContentOnLayout,
  ]);

  return (
    <View style={sectionStyle}>
      <Pressable onPress={toggleExpanded}>
        {renderSectionHeader(item)}
      </Pressable>
      <Animated.View onLayout={onContentViewLayout} style={contentViewStyles}>
        {renderSectionContent(item.data)}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  collapsibleSectionContentOnLayout: {
    position: 'absolute',
    opacity: 0,
  },
});
