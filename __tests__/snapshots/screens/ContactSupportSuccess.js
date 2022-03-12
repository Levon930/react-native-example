import React from 'react';
import renderer from 'react-test-renderer';
import { ContactSupportSuccessScreen } from 'screens';

it('render ContactSupportSuccess screen correctly', () => {
  const tree = renderer.create(
    <ContactSupportSuccessScreen />
  ).toJSON();
  expect(tree).toMatchSnapshot(); 
});
