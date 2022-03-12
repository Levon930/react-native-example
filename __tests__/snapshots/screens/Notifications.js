import React from 'react';
import renderer from 'react-test-renderer';
import { NotificationsScreen } from 'screens';

const navigation = {
  goBack: () => {},
};

it('render Notifications screen correctly', () => {
  const tree = renderer.create(
    <NotificationsScreen navigation={navigation} />
  ).toJSON();
  expect(tree).toMatchSnapshot(); 
});
