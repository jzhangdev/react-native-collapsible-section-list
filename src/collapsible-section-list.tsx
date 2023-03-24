import { FlatList, FlatListProps } from 'react-native';
import {
  CollapsibleSection,
  ICollapsibleSectionProps,
} from './collapsible-section';
import { SectionItemT } from './types';

interface ICollapsibleSectionListProps<T extends SectionItemT>
  extends Pick<
      FlatListProps<T>,
      'keyExtractor' | 'contentContainerStyle' | 'style'
    >,
    Pick<
      ICollapsibleSectionProps<T>,
      'renderSectionHeader' | 'renderSectionContent' | 'sectionStyle'
    > {
  sections: Array<T>;
}

export function CollapsibleSectionList<T extends SectionItemT>({
  sections,
  renderSectionHeader,
  renderSectionContent,
  sectionStyle,
  ...flatListProps
}: ICollapsibleSectionListProps<T>) {
  return (
    <FlatList<T>
      {...flatListProps}
      data={sections}
      renderItem={({ item }) => (
        <CollapsibleSection
          item={item}
          renderSectionHeader={renderSectionHeader}
          renderSectionContent={renderSectionContent}
          sectionStyle={sectionStyle}
        />
      )}
      scrollEnabled={false}
      nestedScrollEnabled
    />
  );
}
