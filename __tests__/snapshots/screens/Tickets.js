import React from 'react';
import renderer from 'react-test-renderer';
import { TicketsScreen } from 'screens';

it('render Tickets screen correctly', () => {
  const tree = renderer.create(
    <TicketsScreen />
  ).toJSON();
  expect(tree).toMatchSnapshot(); 
});
