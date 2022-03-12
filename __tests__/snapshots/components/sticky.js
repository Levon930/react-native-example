import React from 'react';
import renderer from 'react-test-renderer';
import { StickyHeader, SearchTopPanel } from 'components';

test('Sticky Header renders correctly', () => {
  const tree = renderer.create(<StickyHeader />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('SearchTopPanel scrollView renders correctly', () => {
  const tree = renderer.create(<SearchTopPanel />).toJSON();
  expect(tree).toMatchSnapshot();
});
