import React from 'react';
import renderer from 'react-test-renderer';
import { ContactSupportScreen } from 'screens';

const navigation = {
  goBack: () => {},
  addListener: () => {},
  navigate: () => {},
};

it('render ContactSupport screen correctly', () => {
  const tree = renderer.create(
    <ContactSupportScreen navigation={navigation} />
  ).toJSON();
  expect(tree).toMatchSnapshot(); 
});
