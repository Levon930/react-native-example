import React from 'react';
import renderer from 'react-test-renderer';
import { AboutAppScreen } from 'screens';

const navigation = {
  goBack: () => {},
};

it('render AboutApp screen correctly', () => {
  const tree = renderer.create(
    <AboutAppScreen navigation={navigation} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
