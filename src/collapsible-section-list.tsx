import { VirtualizedList, VirtualizedListProps } from 'react-native';
import {
  ICollapsibleSectionProps,
  CollapsibleSection,
} from './collapsible-section';
import { SectionItemT } from './types';

interface ICollapsibleSectionListProps<T extends SectionItemT>
  extends Pick<
      VirtualizedListProps<T>,
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
  ...virtualizedListProps
}: ICollapsibleSectionListProps<T>) {
  return (
    <VirtualizedList<T>
      {...virtualizedListProps}
      data={sections}
      getItem={(section, index) => section[index]}
      getItemCount={() => sections.length}
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
