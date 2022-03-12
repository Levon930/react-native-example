import React from 'react';
import renderer from 'react-test-renderer';
import { FavoritesScreen } from 'screens';

const navigation = {
  goBack: () => {},
  addListener: () => {},
  navigate: () => {},
};

it('render Favorites screen correctly', () => {
  const tree = renderer.create(
    <FavoritesScreen navigation={navigation} />
  ).toJSON();
  expect(tree).toMatchSnapshot(); 
});
