import React from 'react';
import renderer from 'react-test-renderer';
import { ClickableIcon, VehicleIcon } from 'components';

test('Clickable icon renders correctly', () => {
  const tree = renderer.create(<ClickableIcon />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('VehicleIcon scrollView renders correctly', () => {
  const tree = renderer.create(<VehicleIcon />).toJSON();
  expect(tree).toMatchSnapshot();
});
