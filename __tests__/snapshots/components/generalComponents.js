import React from 'react';
import renderer from 'react-test-renderer';
import {
  Button, Divider, Header, Text, FloatingTitleTextInputField,
  TextInput, VerticalDots, Map, LoaderView,
} from 'components';

test('Button renders correctly', () => {
  const tree = renderer.create(<Button />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('Divider renders correctly', () => {
  const tree = renderer.create(<Divider />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('Header renders correctly', () => {
  const tree = renderer.create(
    <Header title='header' />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('Text renders correctly', () => {
  const tree = renderer.create(<Text />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('TextInput renders correctly', () => {
  const tree = renderer.create(<TextInput />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('Map render correctly', () => {
  const tree = renderer.create(<Map />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('VerticalDots render correctly', () => {
  const tree = renderer.create(<VerticalDots smallDotsCount={3} />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('Loader render correctly', () => {
  const tree = renderer.create(<LoaderView />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('FloatingTitleTextInputField render correctly', () => {
  const tree = renderer.create(
    <FloatingTitleTextInputField
      value='test'
      title='test'
      updateMasterState={() => {}}
      attrName='test'
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
