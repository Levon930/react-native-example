import React from 'react';
import renderer from 'react-test-renderer';
import { VehiclesScreen } from 'screens';

it('render Vehicles screen correctly', () => {
  const tree = renderer.create(
    <VehiclesScreen />
  ).toJSON();
  expect(tree).toMatchSnapshot(); 
});
