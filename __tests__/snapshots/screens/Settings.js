import React from 'react';
import renderer from 'react-test-renderer';
import { SettingsScreen } from 'screens';

it('render Settings screen correctly', () => {
  const tree = renderer.create(
    <SettingsScreen />
  ).toJSON();
  expect(tree).toMatchSnapshot(); 
});
