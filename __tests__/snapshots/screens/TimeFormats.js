import React from 'react';
import renderer from 'react-test-renderer';
import { TimeFormatsScreen } from 'screens';

const navigation = {
  goBack: () => {},
  addListener: () => {},
  navigate: () => {},
};

it('render TimeFormats screen correctly', () => {
  const tree = renderer.create(
    <TimeFormatsScreen navigation={navigation} />
  ).toJSON();
  expect(tree).toMatchSnapshot(); 
});
