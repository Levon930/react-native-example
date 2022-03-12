import React from 'react';
import renderer from 'react-test-renderer';
import { Overlay, Row, EndlessScrollView, SafeAreaLayout } from 'components';

test('Overlay renders correctly', () => {
  const tree = renderer.create(<Overlay />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('Row renders correctly', () => {
  const tree = renderer.create(<Row />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('Endless scrollView renders correctly', () => {
  const tree = renderer.create(<EndlessScrollView />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('Safe Area Layout renders correctly', () => {
  const tree = renderer.create(<SafeAreaLayout />).toJSON();
  expect(tree).toMatchSnapshot();
});
